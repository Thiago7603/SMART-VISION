import theme from "@/constants/theme";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* StatusBar translucida con estilo claro */}
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Gradiente debajo de la status bar*/}
      <LinearGradient
        colors={[theme.COLORS.primary, theme.COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: Constants.statusBarHeight,
          width: "100%",
        }}
      />

      {/* Navegación principal*/}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}