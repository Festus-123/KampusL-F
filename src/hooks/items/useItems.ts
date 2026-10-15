import { useContext } from "react";
import { ItemsContext } from "@/context/items/itemsContext";

export function useItems() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider.");
  }

  return context;
}