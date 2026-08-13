import React from "react";
import { AuthProvider, useAuth } from "../providers/UseContext";

import { ModalProvider } from "../../contexts/ModalContext";

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
      <ModalProvider>{children}</ModalProvider>
    </WebSocketProvider>
  );
}

export default AppProvider;
