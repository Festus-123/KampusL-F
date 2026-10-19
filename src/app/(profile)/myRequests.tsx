import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PopUps from "@/components/pop-up/PopUps";
import RequestsDisplay from "@/components/request-display/RequestsDisplay";
import { useRequest } from "@/hooks/requests/userRequest";
import Loading from "@/components/loading/Loading";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export default function MyRequests() {
  const { myRequests, isLoading, getMyRequests, deleteRequest } = useRequest();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setError(null);
    try {
      await getMyRequests();
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load your requests.",
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, [getMyRequests]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const removeRequest = useCallback(
    async (requestId: number) => {
      try {
        await deleteRequest(requestId);
        setRequestToCancel(null);
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not cancel this request.",
        );
        setRequestToCancel(null);
      }
    },
    [deleteRequest],
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 pb-2 pt-3">
        <Text className="text-4xl font-bold text-brand">My Requests</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void loadRequests()}
          className="rounded-lg px-3 py-2 border-[0.1px]"
        >
          <EvilIcons name="refresh" size={24} color="black" />
        </Pressable>
      </View>

      {error && (
        <View className="mx-4 mb-2 flex-row items-center justify-between gap-3 rounded-lg bg-red-50 p-3">
          <Text className="flex-1 text-sm text-red-800">{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => void loadRequests()}
          >
            <Text className="font-semibold text-red-800">Retry</Text>
          </Pressable>
        </View>
      )}

      {isInitialLoading || isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Loading />
        </View>
      ) : (
        <RequestsDisplay
          requests={myRequests}
          onCancelRequest={(request) => setRequestToCancel(request.id)}
        />
      )}

      {requestToCancel !== null && (
        <PopUps
          isType="warning"
          message="Cancel this reclaim request?"
          buttonLabel="Delete request"
          directTo={() => void removeRequest(requestToCancel)}
          cancelLabel="Keep request"
          onCancel={() => setRequestToCancel(null)}
        />
      )}
    </SafeAreaView>
  );
}
