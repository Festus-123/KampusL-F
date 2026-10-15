import { createContext } from "react";

export type LostItem = {
  id: number;
  name: string;
  tag: string;
  properties: string[];
  user_id: number;
  owner_name?: string | null;
  image: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type NewLostItem = Pick<LostItem, "name" | "tag"> &
  Partial<Pick<LostItem, "properties" | "image">>;

export type LostItemUpdates = Partial<NewLostItem & Pick<LostItem, "status">>;

export type LostItemsPage = {
  items: LostItem[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};

export type ItemContextValue = {
  items: LostItem[];
  myItems: LostItem[];
  isLoading: boolean;
  totalCount: number;
  getAllLostItems: () => Promise<LostItem[]>;
  getLostItemsPage: (offset: number, limit?: number) => Promise<LostItemsPage>;
  getMyLostItems: () => Promise<LostItem[]>;
  getLostItemById: (id: number) => Promise<LostItem>;
  createLostItem: (item: NewLostItem) => Promise<LostItem>;
  updateLostItem: (id: number, updates: LostItemUpdates) => Promise<LostItem>;
  deleteLostItem: (id: number) => Promise<LostItem>;
};

export const ItemsContext = createContext<ItemContextValue | undefined>(
  undefined,
);
