import { ScrollView, Text, View } from "react-native";
import type { requestObject } from "@/context/requests/requestContext";
import RequestCard from "@/components/request-card/RequestCard";

type RequestsDisplayProps = {
  requests: requestObject[];
  onCancelRequest: (request: requestObject) => void;
};

const RequestsDisplay = ({
  requests,
  onCancelRequest,
}: RequestsDisplayProps) => (
  <ScrollView
    className="flex-1"
    contentContainerClassName="gap-3 px-4 pb-8 pt-4"
    showsVerticalScrollIndicator
  >
    {requests.length === 0 ? (
      <View className="items-center py-12">
        <Text className="text-center text-slate-600">
          You have not made any requests yet.
        </Text>
      </View>
    ) : (
      requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onCancelRequest={() => onCancelRequest(request)}
        />
      ))
    )}
  </ScrollView>
);

export default RequestsDisplay;
