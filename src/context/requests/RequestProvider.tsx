import { useCallback, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  requestContext,
  type NewRequest,
  type requestObject,
  type requestContextValue,
} from "./requestContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RequestProvider({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  const [requests, setRequests] = useState<requestObject[]>([]);
  const [myRequests, setMyRequests] = useState<requestObject[]>([]);
  const [totalReqCount, setTotalReqCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(
    async function request<T>(
      path: string,
      method = "GET",
      body?: unknown,
    ): Promise<T> {
      if (!API_BASE_URL) {
        throw new Error("EXPO_PUBLIC_API_URL is not configured.");
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/v1/requests${path}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          },
        );
        const payload = (await response.json().catch(() => null)) as
          (T & { error?: string }) | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Request operation failed.");
        }

        if (payload === null) {
          throw new Error("The server returned an empty response.");
        }

        return payload;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken],
  );

  const getAllRequests = useCallback(async () => {
    const result = await request<requestObject[] | requestObject>("");
    const requestList = Array.isArray(result) ? result : [result];
    setRequests(requestList);
    setTotalReqCount(requestList.length);
    return requestList;
  }, [request]);

  const getMyRequests = useCallback(async () => {
    const result = await request<requestObject[] | requestObject>("/byUser");
    const requestList = Array.isArray(result) ? result : [result];
    setMyRequests(requestList);
    return requestList;
  }, [request]);

  const getRequestById = useCallback(
    (id: number) => {
      return request<requestObject>(`/${id}`);
    },
    [request],
  );

  const createRequest = useCallback(
    async (newRequest: NewRequest) => {
      const createdRequest = await request<requestObject>(
        "",
        "POST",
        newRequest,
      );
      setRequests((currentRequests) => [createdRequest, ...currentRequests]);
      setMyRequests((currentRequests) => [createdRequest, ...currentRequests]);
      setTotalReqCount((count) => count + 1);
      return createdRequest;
    },
    [request],
  );

  const deleteRequest = useCallback(
    async (id: number) => {
      const deletedRequest = await request<requestObject>(`/${id}`, "DELETE");
      setRequests((currentRequests) =>
        currentRequests.filter((item) => item.id !== id),
      );
      setMyRequests((currentRequests) =>
        currentRequests.filter((item) => item.id !== id),
      );
      setTotalReqCount((count) => Math.max(0, count - 1));
      return deletedRequest;
    },
    [request],
  );

  return (
    <requestContext.Provider
      value={
        {
          requests,
          myRequests,
          isLoading,
          totalReqCount,
          getAllRequests,
          getMyRequests,
          getRequestById,
          createRequest,
          deleteRequest,
        } satisfies requestContextValue
      }
    >
      {children}
    </requestContext.Provider>
  );
}
