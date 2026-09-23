import { Order } from "./Order";

export interface OrderDetailsProps  {
  order: Order;
  onSubmitRating: (rating: number) => Promise<void>;
  action: () => void;
  actionsLabel: string;
}
