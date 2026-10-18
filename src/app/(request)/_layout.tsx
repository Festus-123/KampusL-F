import { useAuth } from "@/hooks/auth/useAuth";
import { Stack } from "expo-router";

export default function RequestLayout() {
  const { user, accessToken } = useAuth();
  const isAuthenticated = Boolean(user && accessToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="createRequest" />
      </Stack.Protected>
    </Stack>
  );
}
