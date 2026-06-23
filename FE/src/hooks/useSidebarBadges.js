import { useCartStore } from "../stores/Cart/useCartStore";
import { useConversationStore } from "../stores/messages/useConversationStore";

export default function useSidebarBadges() {
  const totalUnreadCount = useConversationStore((s) => s.totalUnreadCount);

  const totalCartItem = useCartStore((s) => s.totalCartItem);

  return {
    message: totalUnreadCount,
    cart: totalCartItem,
  };
}
