import React from "react";
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
} from "react-native";
import {
  VisionCameraProxy,
  runAtTargetFps,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Delegate,
  RunningMode,
} from "./../shared/types";
import { BaseViewCoordinator } from "./../shared/convert";
import { useRunOnJS, useSharedValue } from "react-native-worklets-core";

const { PoseDetection } = NativeModules;
const eventEmitter = new NativeEventEmitter(PoseDetection);

const plugin = VisionCameraProxy.initFrameProcessorPlugin("poseDetection", {});

if (!plugin) {
  throw new Error("Failed to initialize posedetection plugin");
}

// PoseDetectionModule, PoseLandmarkerResult, PoseDetectionResultBundle, FpsMode, PoseDetectionOptions, and PoseDetectionCallbackState
// are TypeScript types/interfaces. In JS, we can use JSDoc for documentation if needed, or omit them entirely.

function getPoseDetectionModule() {
  if (PoseDetection === undefined || PoseDetection === null) {
    throw new Error("PoseDetection module is not available");
  }
  return PoseDetection;
}

const detectorMap = new Map();
eventEmitter.addListener(
  "onResults",
  (args) => {
    const callbacks = detectorMap.get(args.handle);
    if (callbacks) {
      callbacks.onResults(args, callbacks.viewCoordinator);
    }
  }
);
eventEmitter.addListener(
  "onError",
  (args) => {
    const callbacks = detectorMap.get(args.handle);
    if (callbacks) {
      callbacks.onError(args);
    }
  }
);
export function usePoseDetection(
  callbacks,
  runningMode,
  model,
  options
) {
  const [detectorHandle, setDetectorHandle] = React.useState();

  const [cameraViewDimensions, setCameraViewDimensions] = React.useState({ width: 1, height: 1 });

  const cameraViewLayoutChangeHandler = React.useCallback(
    (event) => {
      setCameraViewDimensions({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      });
    },
    []
  );
  const outputOrientation = useSharedValue("portrait");
  const frameOrientation = useSharedValue("portrait");

  const forceOutputOrientation = useSharedValue(undefined);
  const forceCameraOrientation = useSharedValue(undefined);

  React.useEffect(() => {
    forceCameraOrientation.value = options && options.forceCameraOrientation;
    forceOutputOrientation.value = options && options.forceOutputOrientation;
  }, [
    forceCameraOrientation,
    forceOutputOrientation,
    options && options.forceCameraOrientation,
    options && options.forceOutputOrientation,
  ]);

  const mirrorMode =
    (options && options.mirrorMode) ??
    Platform.select({ android: "mirror-front-only", default: "no-mirror" });
  const [cameraDevice, setCameraDevice] = React.useState(undefined);
  const mirrored = React.useMemo(() => {
    if (
      (mirrorMode === "mirror-front-only" &&
        cameraDevice && cameraDevice.position === "front") ||
      mirrorMode === "mirror"
    ) {
      return true;
    } else {
      return false;
    }
  }, [cameraDevice && cameraDevice.position, mirrorMode]);

  const [resizeMode, setResizeMode] = React.useState("cover");

  const { onResults, onError } = callbacks;

  const updateDetectorMap = React.useCallback(() => {
    if (detectorHandle !== undefined) {
      const viewCoordinator = new BaseViewCoordinator(
        cameraViewDimensions,
        mirrored,
        forceCameraOrientation.value ?? frameOrientation.value,
        forceOutputOrientation.value ?? outputOrientation.value,
        resizeMode
      );
      detectorMap.set(detectorHandle, {
        onResults,
        onError,
        viewCoordinator,
      });
    }
  }, [
    cameraViewDimensions,
    detectorHandle,
    forceCameraOrientation.value,
    forceOutputOrientation.value,
    frameOrientation.value,
    mirrored,
    onError,
    onResults,
    outputOrientation.value,
    resizeMode,
  ]);

  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    updateDetectorMap();
  }, [updateDetectorMap]);
  React.useEffect(() => {
    let newHandle;
    console.log(
      `getPoseDetectionModule: delegate = ${options && options.delegate}, runningMode = ${runningMode}, model= ${model}`
    );
    getPoseDetectionModule()
      .createDetector(
        (options && options.numPoses) ?? 1,
        (options && options.minPoseDetectionConfidence) ?? 0.5,
        (options && options.minPosePresenceConfidence) ?? 0.5,
        (options && options.minTrackingConfidence) ?? 0.5,
        (options && options.shouldOutputSegmentationMasks) ?? false,
        model,
        (options && options.delegate) ?? Delegate.GPU,
        runningMode
      )
      .then((handle) => {
        console.log(
          "usePoseDetection.createDetector",
          runningMode,
          model,
          handle
        );
        setDetectorHandle(handle);
        newHandle = handle;
      })
      .catch((e) => {
        console.error(`Failed to create detector: ${e}`);
      });
    return () => {
      console.log(
        "usePoseDetection.useEffect.unsub",
        "releaseDetector",
        newHandle
      );
      if (newHandle !== undefined) {
        getPoseDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [
    options && options.delegate,
    runningMode,
    model,
    options && options.numPoses,
    options && options.minPoseDetectionConfidence,
    options && options.minPosePresenceConfidence,
    options && options.minTrackingConfidence,
    options && options.shouldOutputSegmentationMasks,
  ]);

  const updateDetectorMapFromWorklet = useRunOnJS(updateDetectorMap, [
    updateDetectorMap,
  ]);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (frame.orientation !== frameOrientation.value) {
        console.log("changing frame orientation", frame.orientation);
        frameOrientation.value = frame.orientation;
        updateDetectorMapFromWorklet();
      }
      const orientation =
        forceOutputOrientation.value ?? outputOrientation.value;
      const fpsMode = (options && options.fpsMode) ?? "none";
      if (fpsMode === "none") {
        plugin && plugin.call && plugin.call(frame, {
          detectorHandle,
          orientation,
        });
      } else {
        runAtTargetFps(fpsMode, () => {
          plugin && plugin.call && plugin.call(frame, {
            detectorHandle,
            orientation,
          });
        });
      }
    },
    [
      detectorHandle,
      forceOutputOrientation.value,
      frameOrientation,
      options && options.fpsMode,
      outputOrientation.value,
      updateDetectorMapFromWorklet,
    ]
  );
  return React.useMemo(
    () => ({
      cameraViewLayoutChangeHandler,
      cameraDeviceChangeHandler: (d) => {
        setCameraDevice(d);
        console.log(
          `camera device change. sensorOrientation:${d && d.sensorOrientation}`
        );
      },
      cameraOrientationChangedHandler: (o) => {
        outputOrientation.value = o;
        console.log(`output orientation change:${o}`);
      },
      resizeModeChangeHandler: setResizeMode,
      cameraViewDimensions,
      frameProcessor,
    }),
    [
      cameraViewDimensions,
      cameraViewLayoutChangeHandler,
      frameProcessor,
      outputOrientation,
    ]
  );
}
export function PoseDetectionOnImage(
  imagePath,
  model,
  options
) {
  return getPoseDetectionModule().detectOnImage(
    imagePath,
    (options && options.numPoses) ?? 1,
    (options && options.minPoseDetectionConfidence) ?? 0.5,
    (options && options.minPosePresenceConfidence) ?? 0.5,
    (options && options.minTrackingConfidence) ?? 0.5,
    (options && options.shouldOutputSegmentationMasks) ?? false,
    model,
    (options && options.delegate) ?? Delegate.GPU
  );
}
