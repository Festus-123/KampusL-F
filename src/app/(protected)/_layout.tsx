import { useAuth } from "@/hooks/auth/useAuth";
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  const { user, accessToken } = useAuth();
  const isAuthenticated = Boolean(user && accessToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen
          name="createUpdateItem"
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
