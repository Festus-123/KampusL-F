import { Stack } from "expo-router";
import AuthProvider from "@/context/auth/AuthProvider";
import Toast from "react-native-toast-message";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auths)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
