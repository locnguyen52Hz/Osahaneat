import { OrderStatus } from "./OrderStatus";
 
export interface StatusBadgeProps {
  status: OrderStatus;
  size?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}
