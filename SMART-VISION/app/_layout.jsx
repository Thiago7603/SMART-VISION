import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark"/>

      <Stack screenOptions={{ headerShown: false }}/>

      <View style={{ height: 50, backgroundColor: "black" }} />
    </>
  );
}
