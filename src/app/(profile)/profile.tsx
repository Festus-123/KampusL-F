import PopUps from "@/components/pop-up/PopUps";
import { useAuth } from "@/hooks/auth/useAuth";
import { useItems } from "@/hooks/items/useItems";
import { useRequest } from "@/hooks/requests/userRequest";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const profile = () => {
  const { user } = useAuth();
  const { myItems, getMyLostItems } = useItems();
  const { requests, getAllRequests } = useRequest();

  useEffect(() => {
    const loadProfileStats = async () => {
      try {
        await Promise.all([getMyLostItems(), getAllRequests()]);
      } catch (error) {
        console.error("Failed to load profile stats:", error);
      }
    };

    void loadProfileStats();
  }, [getAllRequests, getMyLostItems]);

  const getFirstLetter = (word: string | undefined) => {
    if (!word) return;

    const letter = word.slice(0, 1);
    return letter;
  };

  const ownedItemIds = new Set(myItems.map((item) => item.id));
  const reclaimRequestsCount = requests.filter((request) =>
    ownedItemIds.has(request.item_id),
  ).length;

  return (
    <SafeAreaView className="flex-1 p-4 items-center justify-center">
      {/* profile logo */}
      <View className="text-9xl rounded-full p-6 bg-brand text-black">
        <Text>{getFirstLetter(user?.name)}</Text>
      </View>
      {/* Profile deyails  */}
      <Text className="text-4xl font-bold">{user?.name}</Text>
      <Text className="text-xl font-bold tracking-widest">{user?.email}</Text>

      <View className="mt-8 w-full flex flex-row items-center gap-4 justify-center">
        <View className="flex flex-col items-center gap-2">
          <MaterialIcons name="post-add" size={24} color="black" />
          <Text className="text-lg">Posts: {myItems.length}</Text>
        </View>

        <View className="flex flex-col items-center gap-2">
          <Ionicons name="return-down-back-outline" size={24} color="black" />
          <Text className="text-lg">Reclaims: {reclaimRequestsCount}</Text>
        </View>

        <View className="flex flex-col items-center gap-2">
          <EvilIcons name="like" size={24} color="black" />
          <Text className="text-lg">Likes: 0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default profile;
