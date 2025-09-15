import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";

export default function useWebSocket(token) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const client = new Client({
      // Kết nối native WebSocket
      brokerURL: "ws://localhost:8080/websocket",

      // Gửi JWT trong header
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      // debug: (str) => console.log("📡 STOMP:", str),

      onConnect: (frame) => {
        console.log("✅ WebSocket connected:", frame);

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
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [token]);

  // Hàm gửi message lên server
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

  return { sendMessage };
}
