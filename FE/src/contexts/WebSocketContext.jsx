import { Client } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useAuthStore } from "../stores/Auth/useAuthStore";
import { useConversationStore } from "../stores/messages/useConversationStore";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ accessToken, children }) {
  const clientRef = useRef(null);

  const [ordersNotify, setOrdersNotify] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/websocket",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: (frame) => {
        // Lắng nghe tin nhắn riêng
        client.subscribe("/user/queue/notify", (message) => {
          const data = JSON.parse(message.body);
          console.log("📩 Notify: ", data);
          setOrdersNotify((prev) => [...prev, data]);
        });

        client.subscribe("/user/queue/message", (messages) => {
          const message = JSON.parse(messages.body);
          console.log(message);
          const myId = useAuthStore.getState().myId;
          const newMessage = {
            ...message,
            isMine: message.senderId === myId,
          };

          const store = useConversationStore.getState();

          store.ensureConversationExists(newMessage);
          // console.log(newMessage);
          store.onIncomingMessage(newMessage);
        });

        // Lắng nghe broadcast
        client.subscribe("/topic/greetings", (message) => {
          console.log("📢 Broadcast:", message.body);
        });
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [accessToken]);

  // Hàm gửi tin nhắn
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
    <WebSocketContext.Provider
      value={{
        sendMessage,
        ordersNotify,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}
