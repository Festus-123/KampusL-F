import Feather from "@expo/vector-icons/Feather";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";

type GoBackProps = {
  fallbackHref?: Href;
};

export default function GoBack({ fallbackHref = "/" }: GoBackProps) {
  const handlePress = () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallbackHref);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={handlePress}
      className="self-start h-11 w-11 items-center justify-center rounded-full bg-brand/70"
    >
      <Feather name="arrow-left" size={24} color="#111827" />
    </Pressable>
  );
}
