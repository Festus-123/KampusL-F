import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable, Text, View } from "react-native";
import type { LostItem } from "@/context/items/itemsContext";

type ItemsCardProps = {
  item: LostItem;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClickReclaim: () => void;
  requestCountOfItem: number;
};

const ItemsCard = ({
  item,
  isOwner = false,
  onEdit,
  onDelete,
  onClickReclaim,
  requestCountOfItem
}: ItemsCardProps) => {

  return (
    <View className="w-full overflow-hidden rounded-xl border-[0.3px]">
      <View className="flex-row items-center gap-3 p-2 w-full">

      <View className="h-24 w-24 overflow-hidden rounded-lg bg-slate-100">
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            contentFit="cover"
            cachePolicy="memory-disk"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <AntDesign name="picture" size={28} color="#94a3b8" />
          </View>
        )}
      </View>

      <View className="min-w-0 flex-1 gap-3">
        <View className="self-start rounded-full bg-slate-100 px-2.5 py-1">
          <Text className="text-xs font-medium text-slate-600" numberOfLines={1}>
            creator: {item.owner_name || "Campus member"}
          </Text>
        </View>
        <Text
          className="text-base font-light italic"
          numberOfLines={1}
        >
          00{item.id}
        </Text>
        <Text
          className="text-xl font-semibold text-slate-900"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-sm font-medium text-slate-600" numberOfLines={1}>
          {item.tag}
        </Text>
        {/* {item.properties.length > 0 && (
          <Text className="text-xs text-slate-500" numberOfLines={2}>
            {item.properties.join(", ")}
          </Text>
        )} */}
        {isOwner ? (
          <View className="mt-1 flex-row gap-2 justify-end items-center">
            <Pressable
              accessibilityRole="button"
              onPress={onEdit}
              className="rounded-lg bg-brand p-3"
            >
              <Text className="text-xs font-semibold">Edit</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onDelete}
              className="rounded-lg border border-red-300 p-3 "
            >
              <Text className="text-xs font-semibold text-red-700">Delete</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onClickReclaim}
            className="mt-1 self-start rounded-xl bg-brand p-2 items-center"
          >
            <Text className="text-xs font-semibold text-secondary">Reclaim</Text>
          </Pressable>
        )}
      </View>
      </View>
        <View className="w-full p-1 items-end">
        { isOwner ? (
          <Pressable>
            <Text>Request Count For This Item {" "} {requestCountOfItem}</Text>
          </Pressable>
        ) : (
          <View> 
              <Text className={`${requestCountOfItem === 0 ? "text-red-600" : "text-green-500"} text-xs italic`}>Requests count for this item {" "} {requestCountOfItem}</Text>
          </View>
        )}
        </View>
    </View>
  );
};

export default ItemsCard;
