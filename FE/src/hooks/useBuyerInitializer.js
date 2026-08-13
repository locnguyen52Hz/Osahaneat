import { useEffect } from "react";
import { useCartStore } from "../stores/Cart/useCartStore";

export function useBuyerInitializer() {
  const fetchCart = useCartStore((s) => s.fetchCart);


  useEffect(() => {
    fetchCart();
  }, []);
}
