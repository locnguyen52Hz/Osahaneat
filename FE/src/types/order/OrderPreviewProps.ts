import { Location } from "../location/Location";
import { OrderPreviewData } from "./OrderPreviewData";

export interface OrderPreviewProps {
  orderInfo: OrderPreviewData;
  createOrder: () => void;
  loading: boolean;
  location: Location | null;
}
