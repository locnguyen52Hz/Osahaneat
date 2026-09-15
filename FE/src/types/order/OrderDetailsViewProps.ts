import { Order } from "./Order";
import { OrderDetailsViewData } from "./OrderDetailsViewData";
import { OrderItem } from "./OrderItem";

export interface OrderDetailsViewProps {
  order: OrderDetailsViewData;
  foods: OrderItem[];
  loadingItems?: boolean;
  footer?: React.ReactNode;
  handleSelectAddress?: () => void;
}
