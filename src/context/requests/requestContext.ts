import { createContext } from "react";

export type requestObject = {
  id: number;
  item_id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  descripts: string[];
  status: string;
  created_at: string;
  updated_at: string;
  item_name?: string;
  item_properties?: string[];
};

export type NewRequest = {
  itemId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  descripts: string[];
};

// export type LostItemUpdates = Partial<NewRequest & Pick<NewRequest, "status">>;

// export type LostItemsPage = {
//   items: LostItem[];
//   total: number;
//   offset: number;
//   limit: number;
//   hasMore: boolean;
// };

export type requestContextValue = {
  requests: requestObject[];
  myRequests: requestObject[];
  requestsForMyItems: requestObject[];
  isLoading: boolean;
  totalReqCount: number;
  getAllRequests: () => Promise<requestObject[]>;
  getMyRequests: () => Promise<requestObject[]>;
  getRequestsForMyItems: () => Promise<requestObject[]>;
  getRequestById: (id: number) => Promise<requestObject>;
  createRequest: (request: NewRequest) => Promise<requestObject>;
  deleteRequest: (id: number) => Promise<requestObject>;
  markRequestReclaimed: (id: number) => Promise<requestObject>;
  setOwnerRequestStatus: (
    id: number,
    status: "returning" | "pending",
  ) => Promise<requestObject>;
  denyOwnerRequest: (id: number) => Promise<requestObject>;
};

export const requestContext = createContext<requestContextValue | undefined>(
  undefined,
);
