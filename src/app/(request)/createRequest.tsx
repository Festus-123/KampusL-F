import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "@/components/input-field/InputField";
import Loading from "@/components/loading/Loading";
import { useRequest } from "@/hooks/requests/userRequest";
import Toast from "react-native-toast-message";

export default function CreateRequest() {
  const { createRequest, isLoading } = useRequest();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const itemId = Number(Array.isArray(id) ? id[0] : id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();
    const descripts = descriptions
      .split(",")
      .map((description) => description.trim())
      .filter(Boolean);

    if (!itemId) {
      Toast.show({
        type: "error",
        text1: "Invalid item",
        text2: "Return to the item and try again.",
      });
      return;
    }

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !trimmedMessage ||
      descripts.length === 0
    ) {
      Toast.show({
        type: "error",
        text1: "Missing information",
        text2: "Complete every required field.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid email",
        text2: "Enter a valid email address.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await createRequest({
        itemId,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
        descripts,
      });
      Toast.show({ type: "success", text1: "Request sent" });
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Couldn't send request",
        text2: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const isBusy = isLoading || isSaving;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-5"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1">
          <Text className="text-center text-3xl font-bold text-brand">
            Request this item
          </Text>
        </View>

        <InputField
          label="Name *"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          editable={!isBusy}
        />
        <InputField
          label="Email *"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isBusy}
        />
        <InputField
          label="Phone *"
          value={phone}
          onChangeText={setPhone}
          placeholder="Your phone number"
          keyboardType="phone-pad"
          editable={!isBusy}
        />
        <InputField
          label="Message *"
          value={message}
          onChangeText={setMessage}
          placeholder="Add a message about this request"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-28 py-3"
          editable={!isBusy}
        />
        <InputField
          label="Descriptions *"
          value={descriptions}
          onChangeText={setDescriptions}
          placeholder="e.g. blue stripe, small tear, initials inside"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="min-h-24 py-3"
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
            <Text className="font-semibold text-slate-900">Send request</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
