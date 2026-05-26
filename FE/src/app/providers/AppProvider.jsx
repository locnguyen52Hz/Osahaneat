import React from "react";
import { AuthProvider, useAuth } from "../providers/UseContext";
import { CartProvider } from "../../features/cart/context/CartContext";
import { ModalProvider } from "../../contexts/ModalContext";
import { OrderProvider } from "../../features/orders/context/OrderContext";
import { LocationProvider } from "../../contexts/LocationContext";
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
      <LocationProvider>
        <CartProvider>
          <ModalProvider>{children}</ModalProvider>
        </CartProvider>
      </LocationProvider>
    </WebSocketProvider>
  );
}


export default AppProvider;
