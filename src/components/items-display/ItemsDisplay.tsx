import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ItemsCard from "@/components/items-card/ItemsCard";
import type { LostItem } from "@/context/items/itemsContext";
import { useItems } from "@/hooks/items/useItems";
import Loading from "../loading/Loading";
import PopUps from "../pop-up/PopUps";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRequest } from "@/hooks/requests/userRequest";

const PAGE_SIZE = 12;

type ItemsDisplayProps = {
  mode?: "public" | "mine";
};

type ReclaimState = {
  state: boolean | null;
  id: number | null;
}

const ItemsDisplay = ({ mode = "public" }: ItemsDisplayProps) => {
  const {user, accessToken} = useAuth();
  const [isReclaiming, setIsReclaiming] = useState<ReclaimState>({
    state: false,
    id: null
  });

  const { items, myItems, getLostItemsPage, getMyLostItems, deleteLostItem } =
    useItems();

  const {requests} = useRequest();
  const router = useRouter();
  const displayedItems = mode === "mine" ? myItems : items;
  const nextOffset = useRef(0);
  const isFetching = useRef(false);
  const hasMoreRef = useRef(true);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const loadPage = useCallback(
    async (refresh = false) => {
      if (isFetching.current || (!refresh && !hasMoreRef.current)) return;

      isFetching.current = true;
      if (refresh) {
        nextOffset.current = 0;
        hasMoreRef.current = true;
        setHasMore(true);
        setIsRefreshing(true);
      } else if (nextOffset.current > 0) {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const page = await getLostItemsPage(nextOffset.current, PAGE_SIZE);
        nextOffset.current += page.items.length;
        hasMoreRef.current = page.hasMore;
        setHasMore(page.hasMore);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load items.",
        );
      } finally {
        isFetching.current = false;
        setIsInitialLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [getLostItemsPage],
  );

  const loadMine = useCallback(
    async (refresh = false) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setError(null);
      if (refresh) setIsRefreshing(true);
      else setIsInitialLoading(true);

      try {
        await getMyLostItems();
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load your items.",
        );
      } finally {
        isFetching.current = false;
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
    },
    [getMyLostItems],
  );

  useEffect(() => {
    if (mode === "mine") void loadMine();
    else void loadPage();
  }, [loadMine, loadPage, mode]);

  const handleDelete = useCallback((id: number) => {
    setDeleteItemId(id);
  }, []);

    const itemKnownId = new Set(items.map((item) => item.id))
  const requestCountForItem = requests.filter((req) => 
    itemKnownId.has(req.item_id)).length;

  const checkStateForReclaim = (itemId: number) => {
    if (!user || !accessToken) {
      setIsReclaiming({ state: true, id: itemId})
      return;
    }

    router.push({
      pathname: "/(request)/createRequest",
      params: {
        id: String(itemId)
      }
    })
    
    // setIsReclaiming({ state: null, id: null})
  }

  const renderItem = useCallback(
    ({ item }: { item: LostItem }) => (
      <ItemsCard
        item={item}
        isOwner={mode === "mine"}
        onEdit={() =>
          router.push({
            pathname: "/(protected)/createUpdateItem",
            params: { id: String(item.id) },
          })
        }
        onDelete={() => handleDelete(item.id)}
        onClickReclaim={() => checkStateForReclaim(item.id)}
        requestCountOfItem={requestCountForItem}
      />
    ),
    [accessToken, handleDelete, mode, router, user],
  );



  return (
    <View className="flex-1 relative pt-4">
      <FlatList
        style={{ flex: 1 }}
        data={displayedItems}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 2,
          paddingTop: 16,
          paddingBottom: 26,
          gap: 12,
          flexGrow: 1,
        }}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        onEndReached={mode === "public" ? () => void loadPage() : undefined}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={() =>
          void (mode === "mine" ? loadMine(true) : loadPage(true))
        }
        ListEmptyComponent={
          isInitialLoading ? (
            <Loading />
          ) : error ? (
            <PopUps
              isType="error"
              message={error}
              buttonLabel="Try again"
              directTo={() =>
                void (mode === "mine" ? loadMine(true) : loadPage(true))
              }
            />
          ) : (
            <Text className="py-8 text-center text-slate-600">
              {mode === "mine"
                ? "You have not added any items yet."
                : "No lost items found."}
            </Text>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <Loading />
          ) : error && displayedItems.length > 0 ? (
            <PopUps
              isType="error"
              message={error}
              buttonLabel="Try again"
              directTo={() =>
                void (mode === "mine" ? loadMine(true) : loadPage(true))
              }
            />
          ) : mode === "public" && hasMore && displayedItems.length > 0 ? (
            <View className="h-4" />
          ) : null
        }
      />
      {deleteItemId !== null && (
        <PopUps
          message="Delete this item permanently?"
          isType="warning"
          buttonLabel="Delete item"
          directTo={async () => {
            try {
              await deleteLostItem(deleteItemId);
              setDeleteItemId(null);
            } catch (deleteError) {
              setError(
                deleteError instanceof Error
                  ? deleteError.message
                  : "Could not delete item. Please try again.",
              );
              setDeleteItemId(null);
            }
          }}
          cancelLabel="Cancel"
          onCancel={() => setDeleteItemId(null)}
        />
      )}

      { isReclaiming.state == true && (
        <PopUps
        buttonLabel="Proceed"
        cancelLabel="Return"
        isType="message"
        message="You aren't authorized to access this feature. Sign in to have access"
        onCancel={() => setIsReclaiming({ ...isReclaiming, state: false})}
        directTo={() => {
          router.push({
            pathname: "/(auths)/signin",
            params : {
              continueToCreate: "2",
              itemId: isReclaiming.id
            }
          })
        }}
      />
      )}
    </View>
  );
};

export default ItemsDisplay;
