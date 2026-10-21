import { useCallback, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  ItemsContext,
  type ItemContextValue,
  type LostItem,
  type LostItemsPage,
  type LostItemUpdates,
  type NewLostItem,
} from "./itemsContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ItemsProvider({ children }: { children: ReactNode }) {
  const { accessToken, signOut, user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [myItems, setMyItems] = useState<LostItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

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
          `${API_BASE_URL.replace(/\/$/, "")}/api/v1/items${path}`,
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
          throw new Error(payload?.error ?? "Lost item request failed.");
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

  const getAllLostItems = useCallback(async () => {
    const result = await request<LostItem[]>("");
    setItems(result);
    setTotalCount(result.length);
    return result;
  }, [request]);

  const getLostItemsPage = useCallback(
    async (offset: number, limit = 12) => {
      const page = await request<LostItemsPage>(
        `/page?offset=${offset}&limit=${limit}`,
      );
      setTotalCount(page.total);
      setItems((currentItems) => {
        if (offset === 0) return page.items;
        const existingIds = new Set(currentItems.map((item) => item.id));
        return [
          ...currentItems,
          ...page.items.filter((item) => !existingIds.has(item.id)),
        ];
      });
      return page;
    },
    [request],
  );

  const getMyLostItems = useCallback(async () => {
    const result = await request<LostItem[]>("/mine");
    setMyItems(result);
    return result;
  }, [request]);

  const getLostItemById = useCallback(
    (id: number) => {
      return request<LostItem>(`/${id}`);
    },
    [request],
  );

  const createLostItem = useCallback(
    async (item: NewLostItem) => {
      const createdItem = await request<LostItem>("", "POST", item);
      const ownedItem = { ...createdItem, owner_name: user?.name ?? null };
      setItems((currentItems) => [ownedItem, ...currentItems]);
      setMyItems((currentItems) => [ownedItem, ...currentItems]);
      setTotalCount((count) => count + 1);
      return createdItem;
    },
    [request, user?.name],
  );

  const updateLostItem = useCallback(
    async (id: number, updates: LostItemUpdates) => {
      const updatedItem = await request<LostItem>(`/${id}`, "PATCH", updates);
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? { ...updatedItem, owner_name: item.owner_name }
            : item,
        ),
      );
      setMyItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? { ...updatedItem, owner_name: item.owner_name }
            : item,
        ),
      );
      return updatedItem;
    },
    [request],
  );

  const deleteLostItem = useCallback(
    async (id: number) => {
      const deletedItem = await request<LostItem>(`/${id}`, "DELETE");
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      setMyItems((currentItems) =>
        currentItems.filter((item) => item.id !== id),
      );
      setTotalCount((count) => Math.max(0, count - 1));
      return deletedItem;
    },
    [request],
  );

  return (
    <ItemsContext.Provider
      value={
        {
          items,
          myItems,
          totalCount,
          isLoading,
          getAllLostItems,
          getLostItemsPage,
          getMyLostItems,
          getLostItemById,
          createLostItem,
          updateLostItem,
          deleteLostItem,
        } satisfies ItemContextValue
      }
    >
      {children}
    </ItemsContext.Provider>
  );
}
