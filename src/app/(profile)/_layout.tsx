import PopUps from "@/components/pop-up/PopUps";
import { useAuth } from "@/hooks/auth/useAuth";
import { Stack, useRouter } from "expo-router";

const _layout = () => {
  const { user, accessToken } = useAuth();
  const isAuthenticated = Boolean(user && accessToken);
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <PopUps
        buttonLabel="Proceed"
        isType="message"
        message="You aren't authorized to access this page. Sign in to have access"
        directTo={() =>
          router.push({
            pathname: "/(auths)/signin",
            params: {
              continueToPrfolie: "1",
            },
          })
        }
      />
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="profile" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="myRequests" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="reclaimers" />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default _layout;
