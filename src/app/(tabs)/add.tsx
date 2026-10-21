import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddItemButton from "@/components/add-item-button/AddItemButton";
import ItemsDisplay from "@/components/items-display/ItemsDisplay";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";
import PopUps from "@/components/pop-up/PopUps";

const Add = () => {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  if (!user || !accessToken) {
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
    <SafeAreaView className="flex-1 p-4 pb-8" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-3xl text-brand font-bold text-slate-900">My items</Text>
          <Text className="text-sm text-slate-500">Manage your posts</Text>
        </View>
        <AddItemButton />
      </View>
      <ItemsDisplay mode="mine" />
    </SafeAreaView>
  );
};

export default Add;
