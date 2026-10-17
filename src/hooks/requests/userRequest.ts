import { useContext } from "react";
import { requestContext } from "@/context/requests/requestContext";

export function useRequest() {
  const context = useContext(requestContext);

  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider.");
  }

  return context;
}