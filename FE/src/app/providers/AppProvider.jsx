import React from "react";
import { AuthProvider, useAuth } from "../providers/UseContext";

import { ModalProvider } from "../../contexts/ModalContext";

import { WebSocketProvider } from "../../contexts/WebSocketContext";
import { useAuthStore } from "../../stores/Auth/useAuthStore";

function AppProvider({ children }) {
  return <AuthConsumerWrapper>{children}</AuthConsumerWrapper>;
}

function AuthConsumerWrapper({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <WebSocketProvider accessToken={accessToken}>
      <ModalProvider>{children}</ModalProvider>
    </WebSocketProvider>
  );
}

export default AppProvider;
