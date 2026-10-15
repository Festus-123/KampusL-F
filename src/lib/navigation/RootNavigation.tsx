import { Stack } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import PopUps from "@/components/pop-up/PopUps";

export default function RootNavigation() {
  const { user, accessToken } = useAuth();
  const isAuthenticated = Boolean(user && accessToken);


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auths)" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
    </Stack>
  );
}
