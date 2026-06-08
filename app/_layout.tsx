import { Stack } from "expo-router";
import "../app/global.css";  // or correct path

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
