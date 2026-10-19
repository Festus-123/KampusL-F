import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { requestObject } from "@/context/requests/requestContext";

type RequestCardProps = {
  request: requestObject;
  onCancelRequest: () => void;
};

const RequestCard = ({ request, onCancelRequest }: RequestCardProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <View className="gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-lg font-semibold text-slate-900">
            {request.item_name || `Item #${request.item_id}`}
          </Text>
          <Text className="text-sm text-slate-600">
            Requested by {request.name}
          </Text>
        </View>
      </View>

      <Text className="text-xs font-medium uppercase text-slate-500">
        Status: {request.status}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isPreviewOpen }}
        onPress={() => setIsPreviewOpen((isOpen) => !isOpen)}
        className="self-start py-1"
      >
        <Text className="font-semibold text-blue-700">
          {isPreviewOpen ? "Hide request preview" : "Preview request"}
        </Text>
      </Pressable>

      {isPreviewOpen && (
        <View className="gap-3 rounded-lg bg-slate-50 p-3">
          <View className="gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500">
              Message
            </Text>
            <Text className="text-sm leading-5 text-slate-800">
              {request.message}
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-xs font-semibold uppercase text-slate-500">
              Requester descriptions
            </Text>
            <Text className="text-sm leading-5 text-slate-800">
              {request.descripts.length > 0
                ? request.descripts.join(", ")
                : "No descriptions provided."}
            </Text>
          </View>
          <Text className="text-xs text-slate-600">
            Contact: {request.email} · {request.phone}
          </Text>
        </View>
      )}

      <View className="flex-row justify-end border-t border-slate-100 pt-3">
        <Pressable
          accessibilityRole="button"
          onPress={onCancelRequest}
          className="min-h-11 items-center justify-center rounded-lg border border-red-300 px-3"
        >
          <Text className="text-sm font-semibold text-red-700">
            Cancel request
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RequestCard;
