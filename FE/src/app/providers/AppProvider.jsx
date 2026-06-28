import React from "react";
import { AuthProvider, useAuth } from "../providers/UseContext";
import { CartProvider } from "../../features/cart/context/CartContext";
import { ModalProvider } from "../../contexts/ModalContext";
import { OrderProvider } from "../../features/orders/context/OrderContext";

import { WebSocketProvider } from "../../contexts/WebSocketContext";

function AppProvider({ children }) {
  return (
    <AuthProvider>
      <AuthConsumerWrapper>{children}</AuthConsumerWrapper>
    </AuthProvider>
  );
}

function AuthConsumerWrapper({ children }) {
  const { token } = useAuth();

  return (
    <WebSocketProvider token={token}>
      <CartProvider>
        <ModalProvider>{children}</ModalProvider>
      </CartProvider>
    </WebSocketProvider>
  );
}

export default AppProvider;
