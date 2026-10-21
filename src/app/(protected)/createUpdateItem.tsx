import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "@/components/input-field/InputField";
import { useItems } from "@/hooks/items/useItems";
import Toast from "react-native-toast-message";
import Loading from "@/components/loading/Loading";
import GoBack from "@/components/go-back/GoBack";
import Feather from "@expo/vector-icons/Feather";

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
  const [isPickingImage, setIsPickingImage] = useState(false);

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
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: "Couldn't save item",
        text2: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePickImage() {
    if (Platform.OS === "web") {
      Toast.show({
        type: "info",
        text1: "Use the mobile app",
        text2: "Device photos can be stored from the installed app.",
      });
      return;
    }

    setIsPickingImage(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const extension = (
        asset.mimeType?.split("/")[1] ??
        asset.fileName?.split(".").pop() ??
        "jpg"
      )
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase();
      const localFile = new File(
        Paths.document,
        `item-${Date.now()}.${extension || "jpg"}`,
      );

      await new File(asset.uri).copy(localFile);
      setImage(localFile.uri);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Couldn't select image",
        text2: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsPickingImage(false);
    }
  }

  const isBusy = isLoading || isLoadingItem || isSaving || isPickingImage;

  return (
    <SafeAreaView className="flex-1 bg-white " edges={["top"]}>
      <GoBack fallbackHref="/(tabs)" />
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
        <View className="gap-3">
          <Text className="font-medium text-slate-900">Item photo</Text>
          <View className="flex-row items-center gap-3">
            <View className="h-24 w-24 overflow-hidden rounded-lg bg-slate-100">
              {image ? (
                <ExpoImage
                  source={{ uri: image }}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Feather name="image" size={28} color="#94a3b8" />
                </View>
              )}
            </View>
            <View className="flex-1 gap-2">
              <Pressable
                accessibilityRole="button"
                disabled={isBusy || Platform.OS === "web"}
                onPress={() => void handlePickImage()}
                className="min-h-11 flex-row items-center justify-center gap-2 rounded-lg bg-brand px-3"
              >
                <Feather name="image" size={18} color="#111827" />
                <Text className="font-semibold text-slate-900">
                  {isPickingImage ? "Opening photos..." : "Choose from device"}
                </Text>
              </Pressable>
              {Platform.OS === "web" ? (
                <Text className="text-xs text-slate-500">
                  Device photo storage is available in the mobile app.
                </Text>
              ) : null}
              {image ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={isBusy}
                  onPress={() => setImage("")}
                  className="self-start px-2 py-1"
                >
                  <Text className="text-sm text-red-700">Remove photo</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
          <InputField
            label="Or use an image URL"
            value={image.startsWith("file://") ? "" : image}
            onChangeText={setImage}
            placeholder="https://..."
            autoCapitalize="none"
            keyboardType="url"
            editable={!isBusy}
          />
        </View>

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
