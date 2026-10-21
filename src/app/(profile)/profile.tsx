import PopUps from "@/components/pop-up/PopUps";
import { useAuth } from "@/hooks/auth/useAuth";
import { useItems } from "@/hooks/items/useItems";
import { useRequest } from "@/hooks/requests/userRequest";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import GoBack from "@/components/go-back/GoBack";

const profile = () => {
  const { user, signOut } = useAuth();
  const { myItems, getMyLostItems } = useItems();
  const { requests } = useRequest();

  useEffect(() => {
    const loadProfileStats = async () => {
      try {
        await getMyLostItems();
      } catch (error) {
        console.error("Failed to load profile stats:", error);
      }
    };

    void loadProfileStats();
  }, [getMyLostItems]);

  const getFirstLetter = (word: string | undefined) => {
    if (!word) return;

    const letter = word.slice(0, 1);
    return letter;
  };

  const ownedItemIds = new Set(myItems.map((item) => item.id));
  const reclaimRequestsCount = requests.filter((request) =>
    ownedItemIds.has(request.item_id),
  ).length;

  const handleSignout = async () => {
    try {
      signOut();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign out Failed",
        text2: "Try again please",
      });
      throw new Error("Error Signing out");
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 items-center">
      <GoBack fallbackHref="/(tabs)" />
      {/* profile logo */}
      <View className="h-40 w-40 items-center justify-center rounded-full bg-brand mb-2">
        <Text className="text-8xl font-bold text-black">
          {getFirstLetter(user?.name)}
        </Text>
      </View>
      {/* Profile deyails  */}
      <Text className="text-4xl font-bold">{user?.name}</Text>
      <Text className="text-xl font-light tracking-widest mb-4">
        {user?.email}
      </Text>

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

      {/* path to operations */}
      <View className="w-full items-start gap=2 p-2 mt-6">
        <Pressable
          onPress={() => router.push({ pathname: "/(profile)/myRequests" })}
          className="p-4 border-b border-[0.1] w-full flex flex-row items-center gap-4"
        >
          <Feather name="git-pull-request" size={24} color="black" />
          <Text className="text-2xl text-black">My Requests</Text>
        </Pressable>

        <Pressable
          disabled
          className="p-4 opacity-50 border-b boder-[0.1px] w-full flex flex-row item-center gap-4"
        >
          <AntDesign name="notification" size={24} color="black" />
          <Text className="text-2xl text-black">Notifications</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: "/(profile)/reclaimers" })}
          className="p-4 border-b border-[0.1] w-full flex flex-row items-center gap-4"
        >
          <Ionicons name="people-outline" size={24} color="black" />
          <Text className="text-2xl text-black">Reclaimers</Text>
        </Pressable>

        <Pressable
          onPress={handleSignout}
          className="p-4 border-b border-[0.1] w-full flex flex-row items-center gap-4"
        >
          <MaterialIcons name="logout" size={24} color="black" />
          <Text className="text-2xl text-red-600">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default profile;
