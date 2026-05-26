import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import { apiGet } from "../api/api";
import endpoints from "../api/endpoints";
import { useConversationStore } from "../stores/messages/useConversationStore";
import { useChatScroll } from "../features/messages/hooks/useChatScroll";
import { useAuthStore } from "../stores/Auth/useAuthStore";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ token, children }) {
  const clientRef = useRef(null);

  const [ordersNotify, setOrdersNotify] = useState([]);
  const onIncomingMessage = useConversationStore((s) => s.onIncomingMessage);
  const conversationMap = useConversationStore((s) => s.conversationMap);
  const conversationList = useConversationStore((s) => s.conversationList);
  const ensureConversationExists = useConversationStore(
    (s) => s.ensureConversationExists,
  );
  const messagesByConversation = useConversationStore(
    (s) => s.messagesByConversation,
  );
  const bufferRealtimeMessage = useConversationStore(
    (s) => s.bufferRealtimeMessage,
  );
  const pendingMessagesByConversation = useConversationStore(
    (s) => s.pendingMessagesByConversation,
  );

  // message listeners (event-based)
  const messageListenersRef = useRef(new Set());

  // console.log(token);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/websocket",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: (frame) => {
        // console.log("✅ WebSocket connected:");
        // Lắng nghe tin nhắn riêng
        client.subscribe("/user/queue/notify", (message) => {
          const data = JSON.parse(message.body);
          console.log("📩 Notify: ", data);
          setOrdersNotify((prev) => [...prev, data]);
        });

        client.subscribe("/user/queue/message", (messages) => {
          const message = JSON.parse(messages.body);

          const myId = useAuthStore.getState().myId;
          const newMessage = {
            ...message,
            isMine: message.senderId === myId,
          };
          console.log(newMessage)

          const store = useConversationStore.getState();

          store.ensureConversationExists(newMessage);
          // console.log(newMessage)
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
  }, [token]);

  // useEffect(() => {
  //   if (!token) {
  //     setOrdersNotify([]);
  //     return;
  //   }
  //   const fetchUnreadMessage = async () => {
  //     try {
  //       const res = await apiGet(endpoints.messages.countUnreadMessage);

  //       console.log(res.data.data)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchUnreadMessage();
  // }, [token]);

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
