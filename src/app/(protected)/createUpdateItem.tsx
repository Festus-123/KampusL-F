import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "@/components/input-field/InputField";
import { useItems } from "@/hooks/items/useItems";
import Toast from "react-native-toast-message";
import Loading from "@/components/loading/Loading";

export default function CreateUpdateItem() {
  const { createLostItem, getLostItemById, updateLostItem, isLoading } =
    useItems();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const itemId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [properties, setProperties] = useState("");
  const [image, setImage] = useState("");
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    const parsedId = Number(itemId);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      Toast.show({
        type: "error",
        text1: "Invalid item",
        text2: "please try again",
      });
      return;
    }

    let isActive = true;
    setIsLoadingItem(true);

    getLostItemById(parsedId)
      .then((item) => {
        if (!isActive) return;
        setName(item.name);
        setTag(item.tag);
        setProperties(item.properties.join(", "));
        setImage(item.image ?? "");
      })
      .catch((error: unknown) => {
        if (isActive) {
          Toast.show({
            type: "error",
            text1: "Couldn't load item",
            text2: "please try again",
          });
        }
      })
      .finally(() => {
        if (isActive) setIsLoadingItem(false);
      });

    return () => {
      isActive = false;
    };
  }, [getLostItemById, itemId]);

  async function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedTag = tag.trim();

    if (!trimmedName || !trimmedTag) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Name and tags are required",
      });
      return;
    }

    const item = {
      name: trimmedName,
      tag: trimmedTag,
      properties: properties
        .split(",")
        .map((property) => property.trim())
        .filter(Boolean),
      image: image.trim() || null,
    };

    setIsSaving(true);
    try {
      if (itemId) {
        await updateLostItem(Number(itemId), item);
      } else {
        await createLostItem(item);
      }
      router.replace("/(tabs)");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: "Couldn't save item",
        text2: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const isBusy = isLoading || isLoadingItem || isSaving;

  return (
    <SafeAreaView className="flex-1 bg-white " edges={["top"]}>
      <ScrollView
        className="flex-1 py-8"
        contentContainerClassName="gap-5 p-5 "
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1 ">
          <Text className="text-4xl font-bold text-brand text-center">
            {itemId ? "Update item" : "Report a lost item"}
          </Text>
          <Text className="text-sm text-slate-600 text-center">
            Enter the item details below.
          </Text>
        </View>

        <InputField
          label="Item name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Black backpack"
          autoCapitalize="words"
          editable={!isBusy}
        />
        <InputField
          label="Tag *"
          value={tag}
          onChangeText={setTag}
          placeholder="e.g. Bags"
          autoCapitalize="words"
          editable={!isBusy}
        />
        <InputField
          label="Properties"
          value={properties}
          onChangeText={setProperties}
          placeholder="Separate details with commas"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="min-h-24 py-3"
          editable={!isBusy}
        />
        <InputField
          label="Image URL"
          value={image}
          onChangeText={setImage}
          placeholder="https://..."
          autoCapitalize="none"
          keyboardType="url"
          editable={!isBusy}
        />

        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={handleSubmit}
          className={`min-h-12 items-center justify-center rounded-xl px-4 ${isBusy ? "bg-slate-300" : "bg-brand"}`}
        >
          {isBusy ? (
            <Loading />
          ) : (
            <Text className="font-semibold text-slate-900">
              {itemId ? "Save changes" : "Create item"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
