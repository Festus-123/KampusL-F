import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import PopUps from "@/components/pop-up/PopUps";
import Loading from "@/components/loading/Loading";
import type { requestObject } from "@/context/requests/requestContext";
import { useRequest } from "@/hooks/requests/userRequest";
import { validateRequestDescriptions } from "@/lib/request-validator/RequestValidator";
import GoBack from "@/components/go-back/GoBack";

type PendingAction = {
  request: requestObject;
  action: "deny" | "return";
};

export default function Reclaimers() {
  const {
    requestsForMyItems,
    isLoading,
    getRequestsForMyItems,
    setOwnerRequestStatus,
    denyOwnerRequest,
  } = useRequest();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setError(null);
    try {
      await getRequestsForMyItems();
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load reclaim requests.",
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, [getRequestsForMyItems]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const returnRequest = useCallback(
    async (request: requestObject) => {
      try {
        const contact = [
          `Name: ${request.name}`,
          `Phone: ${request.phone}`,
          `Email: ${request.email}`,
        ].join("\n");
        await Clipboard.setStringAsync(contact);
        await setOwnerRequestStatus(request.id, "returning");
        setPendingAction(null);
        setSuccessMessage(
          `Contact details copied. Contact ${request.name} via any medium to arrange the return.`,
        );
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not start the return process.",
        );
        setPendingAction(null);
      }
    },
    [setOwnerRequestStatus],
  );

  const denyRequest = useCallback(
    async (requestId: number) => {
      try {
        await denyOwnerRequest(requestId);
        setPendingAction(null);
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not deny this request.",
        );
        setPendingAction(null);
      }
    },
    [denyOwnerRequest],
  );

  const cancelReturnProcess = useCallback(
    async (requestId: number) => {
      try {
        await setOwnerRequestStatus(requestId, "pending");
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not cancel the return process.",
        );
      }
    },
    [setOwnerRequestStatus],
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4" edges={["top"]}>
      <View className="flex-row items-center justify-between gap-3 px-4 pb-2 pt-3">
        <GoBack fallbackHref="/(tabs)" />
        <Text className="flex-1 text-3xl font-bold text-brand">Reclaimers</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh reclaim requests"
          onPress={() => void loadRequests()}
          className="rounded-lg border-[0.1px] px-3 py-2"
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
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 px-4 pb-8 pt-4"
          showsVerticalScrollIndicator
        >
          {requestsForMyItems.length === 0 ? (
            <View className="items-center py-12">
              <Text className="text-center text-slate-600">
                No reclaim requests have been made for your items.
              </Text>
            </View>
          ) : (
            requestsForMyItems.map((request) => {
              const match = validateRequestDescriptions(
                request.item_properties,
                request.descripts,
              ).percentage;
              const matchStyle =
                match >= 70
                  ? "border-green-500 bg-green-50 text-green-800"
                  : match < 45
                    ? "border-red-500 bg-red-50 text-red-800"
                    : "border-blue-500 bg-blue-50 text-blue-800";
              const isReturning = request.status === "returning";
              const isPreviewOpen = previewId === request.id;

              return (
                <View
                  key={request.id}
                  className="gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="min-w-0 flex-1 gap-1">
                      <Text className="text-lg font-semibold text-slate-900">
                        {request.item_name || `Item #${request.item_id}`}
                      </Text>
                      <Text className="text-sm text-slate-600">
                        Reclaimer: {request.name}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full border px-3 py-1 ${matchStyle}`}
                    >
                      <Text className="text-xs font-semibold">
                        {match}% match
                      </Text>
                    </View>
                  </View>

                  <Text className="text-xs font-medium uppercase text-slate-500">
                    Status: {request.status}
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isPreviewOpen }}
                    onPress={() =>
                      setPreviewId(isPreviewOpen ? null : request.id)
                    }
                    className="self-start py-1"
                  >
                    <Text className="font-semibold text-blue-700">
                      {isPreviewOpen ? "Hide details" : "Preview details"}
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
                          Reclaimer descriptions
                        </Text>
                        <Text className="text-sm leading-5 text-slate-800">
                          {request.descripts.length > 0
                            ? request.descripts.join(", ")
                            : "No descriptions provided."}
                        </Text>
                      </View>
                      <Text className="text-xs text-slate-600">
                        {request.name} · {request.phone} · {request.email}
                      </Text>
                    </View>
                  )}

                  <View className="flex-row gap-3 border-t border-slate-100 pt-3">
                    {isReturning ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => void cancelReturnProcess(request.id)}
                        className="min-h-11 flex-1 items-center justify-center rounded-lg border border-amber-400 px-3"
                      >
                        <Text className="text-center text-sm font-semibold text-amber-800">
                          Cancel process
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => void returnRequest(request)}
                        className="min-h-11 flex-1 items-center justify-center rounded-lg bg-brand px-3"
                      >
                        <Text className="text-center text-sm font-semibold text-slate-900">
                          Return
                        </Text>
                      </Pressable>
                    )}
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        setPendingAction({ request, action: "deny" })
                      }
                      className="min-h-11 flex-1 items-center justify-center rounded-lg border border-red-300 px-3"
                    >
                      <Text className="text-center text-sm font-semibold text-red-700">
                        Deny
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {pendingAction?.action === "deny" && (
        <PopUps
          isType="warning"
          message={`Deny ${pendingAction.request.name}'s request for ${pendingAction.request.item_name || "this item"}?`}
          buttonLabel="Deny request"
          directTo={() => void denyRequest(pendingAction.request.id)}
          cancelLabel="Keep request"
          onCancel={() => setPendingAction(null)}
        />
      )}

      {successMessage && (
        <PopUps
          isType="success"
          message={successMessage}
          buttonLabel="Done"
          directTo={() => setSuccessMessage(null)}
        />
      )}
    </SafeAreaView>
  );
}
