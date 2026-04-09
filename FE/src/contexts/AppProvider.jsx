import React from "react";
import { AuthProvider, useAuth } from "./UseContext";
import { CartProvider } from "./CartContext";
import { ModalProvider } from "./ModalContext";
import { OrderProvider } from "./OrderContext";
import { LocationProvider } from "./LocationContext";
import { WebSocketProvider } from "./WebSocketContext";

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
