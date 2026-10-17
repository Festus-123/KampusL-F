import { useItems } from "@/hooks/items/useItems";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useRequest } from "@/hooks/requests/userRequest";

const ScoreBoard = () => {
  const { totalCount } = useItems();
  const { totalReqCount } = useRequest();
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <View className="w-full rounded-xl p-4 bg-brand border-[0.5]">
      {/* title */}
      <Text className="text-secondry text-3xl">Score Board</Text>

      {/* total items */}
      <View className="flex flex-row items-center justify-between p-4">
        <View className="flex flex-col gap-2">
          <View>
            {visible ? (
              <Text className="text-xl font-extrabold">{totalCount} items</Text>
            ) : (
              <Text className="text-secondry text-xl font-semibold">
                --- ---
              </Text>
            )}
          </View>

          <View>
            {visible ? (
              <Text>{totalReqCount} Claims</Text>
            ) : (
              <Text>--- ---</Text>
            )}
          </View>

          <Text className="text-green-600 text-xs italic">
            System Status Looking good
          </Text>
        </View>

        <TouchableOpacity onPress={() => setVisible(!visible)}>
          {visible ? (
            <Feather name="eye" size={24} color="black" />
          ) : (
            <AntDesign name="eye-invisible" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* later */}
      {/* No of claim requests */}
    </View>
  );
};

export default ScoreBoard;
