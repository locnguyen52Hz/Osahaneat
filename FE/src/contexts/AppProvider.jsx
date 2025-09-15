import React from "react";
import { AuthProvider } from "./UseContext";
import { CartProvider } from "./CartContext";
import { ModalProvider } from "./ModalContext";
import { OrderProvider } from "./OrderContext";
import { LocationProvider } from "./LocationContext";

function AppProvider({ children }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <OrderProvider>
            <ModalProvider>{children}</ModalProvider>
          </OrderProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default AppProvider;
