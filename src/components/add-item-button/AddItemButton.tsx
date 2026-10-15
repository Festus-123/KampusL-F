import { Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@/hooks/auth/useAuth";
import PopUps from "../pop-up/PopUps";
import { useState } from "react";

export default function AddItemButton() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [isUser, setIsUser] = useState(true);

  const handlePress = () => {
    if (user && accessToken) {
      router.push("/(protected)/createUpdateItem");
      return;
    }
    setIsUser(false);
  };

  if (!isUser) {
    return (
      <PopUps
        buttonLabel="Proceed"
        isType="message"
        message="You aren't authorized to access this page. Sign in to have access"
        directTo={() =>
          router.push({
            pathname: "/(auths)/signin",
            params: {
              continueToCreate: "1",
            },
          })
        }
      />
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Create a lost item"
      onPress={handlePress}
    >
      <AntDesign name="plus" size={26} color="black" />
    </Pressable>
  );
}
