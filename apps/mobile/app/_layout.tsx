import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#E8EEF7",
          contentStyle: { backgroundColor: "#0B1220" },
        }}
      />
    </>
  );
}
