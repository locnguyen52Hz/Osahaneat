import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ token, children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/websocket",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: (frame) => {
        console.log("✅ WebSocket connected:", frame);
        setConnected(true);

        // Lắng nghe tin nhắn riêng cho user
        client.subscribe("/user/queue/notify", (message) => {
          console.log("📩 Notify:", message.body);
        });

        // Lắng nghe broadcast chung
        client.subscribe("/topic/greetings", (message) => {
          console.log("📢 Broadcast:", message.body);
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [token]);

  // Hàm gửi message
  const sendMessage = (destination, body) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn("⚠️ STOMP client chưa kết nối!");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook tiện lợi để dùng context
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocketContext phải được dùng trong WebSocketProvider");
  return context;
};
