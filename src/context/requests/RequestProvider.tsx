import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  requestContext,
  type NewRequest,
  type requestObject,
  type requestContextValue,
} from "./requestContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RequestProvider({ children }: { children: ReactNode }) {
  const { accessToken, signOut } = useAuth();
  const [requests, setRequests] = useState<requestObject[]>([]);
  const [myRequests, setMyRequests] = useState<requestObject[]>([]);
  const [requestsForMyItems, setRequestsForMyItems] = useState<requestObject[]>(
    [],
  );
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
          if (response.status === 401 && accessToken) signOut();
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
    [accessToken, signOut],
  );

  const getAllRequests = useCallback(async () => {
    const requestList = await request<requestObject[]>("");
    setRequests(requestList);
    setTotalReqCount(requestList.length);
    return requestList;
  }, [request]);

  const getMyRequests = useCallback(async () => {
    const requestList = await request<requestObject[]>("/byUser");
    setMyRequests(requestList);
    return requestList;
  }, [request]);

  const getRequestsForMyItems = useCallback(async () => {
    const requestList = await request<requestObject[]>("/byOwner");
    setRequestsForMyItems(requestList);
    return requestList;
  }, [request]);

  useEffect(() => {
    void getAllRequests().catch((error) => {
      console.error("Failed to load requests:", error);
    });
  }, [getAllRequests]);

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

  const markRequestReclaimed = useCallback(
    async (id: number) => {
      const updatedRequest = await request<requestObject>(
        `/${id}/status`,
        "PATCH",
        { status: "reclaimed" },
      );
      setRequests((currentRequests) =>
        currentRequests.map((item) => (item.id === id ? updatedRequest : item)),
      );
      setMyRequests((currentRequests) =>
        currentRequests.map((item) => (item.id === id ? updatedRequest : item)),
      );
      return updatedRequest;
    },
    [request],
  );

  const setOwnerRequestStatus = useCallback(
    async (id: number, status: "returning" | "pending") => {
      const updatedRequest = await request<requestObject>(
        `/${id}/owner-status`,
        "PATCH",
        { status },
      );
      setRequestsForMyItems((currentRequests) =>
        currentRequests.map((item) => (item.id === id ? updatedRequest : item)),
      );
      setRequests((currentRequests) =>
        currentRequests.map((item) => (item.id === id ? updatedRequest : item)),
      );
      return updatedRequest;
    },
    [request],
  );

  const denyOwnerRequest = useCallback(
    async (id: number) => {
      const deletedRequest = await request<requestObject>(
        `/${id}/owner`,
        "DELETE",
      );
      setRequestsForMyItems((currentRequests) =>
        currentRequests.filter((item) => item.id !== id),
      );
      setRequests((currentRequests) =>
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
          requestsForMyItems,
          isLoading,
          totalReqCount,
          getAllRequests,
          getMyRequests,
          getRequestsForMyItems,
          getRequestById,
          createRequest,
          deleteRequest,
          markRequestReclaimed,
          setOwnerRequestStatus,
          denyOwnerRequest,
        } satisfies requestContextValue
      }
    >
      {children}
    </requestContext.Provider>
  );
}
