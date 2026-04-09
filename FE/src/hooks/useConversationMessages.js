// conversation/useConversationMessages.js
import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost } from "../api/api";
import endpoints from "../api/endpoints";
import {
  normalizeMessages,
  groupMessagesByDate,
  mergeGroupedMessages,
} from "../util/message";
import axios from "axios";
import { useConversationStore } from "../stores/messages/useConversationStore";
import { useAuthStore } from "../stores/Auth/useAuthStore";

export const useConversationMessages = () => {
  const activeConversationId = useConversationStore(
    (s) => s.activeConversationId,
  );
  const conversationMap = useConversationStore((s) => s.conversationMap);
  const activeConversation = conversationMap[activeConversationId];
  // console.log(activeConversation)

  const authStore = useAuthStore.getState()
  authStore.loadUserFromToken()
  const myId = authStore.myId
  const [messages, setMessages] = useState([]);
  // console.log(messages)
  const [oldestCursor, setOldestCursor] = useState(null); // tin nhắn cũ nhất đã tải
  const [latestCursor, setLatestCursor] = useState(null); // tin nhắn mới nhất đã tải
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);
  // console.log(oldestCursor);
  useEffect(() => {
    if (!activeConversationId) return;

    setMessages([]);
    setOldestCursor(null);
    setLatestCursor(null);
  }, [activeConversationId]);

  const addNewMessageToGroupedMessages = (newMsg) => {
    setMessages((prevGrouped) => {
  
      const dateKey = new Date(newMsg.createdAt).toLocaleDateString("vi-VN");

      const msg = {
        ...newMsg,
        isMine: newMsg.senderId === myId,
      };

      // grouped rỗng
      if (!prevGrouped.length) {
        return [
          {
            createdAt: dateKey,
            messages: [msg],
          },
        ];
      }

      const lastGroupIndex = prevGrouped.length - 1;
      const lastGroup = prevGrouped[lastGroupIndex];

      // tránh duplicate (WS có thể gửi lại)
      const isDuplicate = prevGrouped.some((group) =>
        group.messages.some((m) => m.id === msg.id),
      );
      if (isDuplicate) return prevGrouped;

      // cùng ngày → append
      if (lastGroup.createdAt === dateKey) {
        const newState = [...prevGrouped];
        newState[lastGroupIndex] = {
          ...lastGroup,
          messages: [...lastGroup.messages, msg],
        };
        return newState;
      }

      // khác ngày → tạo group mới
      return [
        ...prevGrouped,
        {
          createdAt: dateKey,
          messages: [msg],
        },
      ];
    });
  };

  const loadMoreOldestMessage = async () => {
    if (!oldestCursor) return;

    setLoading(true);

    const body = {
      conversationId: activeConversation.id,
      partnerId: activeConversation.partnerId,
      messageCursor: oldestCursor,
    };

    try {
      const res = await apiPost(endpoints.messages.olderMessages, body);
      const { messages, oldestCursor } = res.data?.data;
      // console.log(res.data)
      
      const grouped = groupMessagesByDate(normalizeMessages(messages, myId)); // chuẩn hóa và nhóm tin nhắn theo ngày

      setOldestCursor(oldestCursor); //trỏ tin cũ nhất
      setMessages((prev) => mergeGroupedMessages(prev, grouped, "prepend")); // thêm tin cũ vào
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (newMessage) => {
    const msgBody = {
      receiverId: activeConversation.partnerId,
      content: newMessage.trim(),
    };
    console.log(msgBody);

    try {
      const res = await apiPost(endpoints.messages.send, msgBody);
      console.log(res.data.data);
      addNewMessageToGroupedMessages(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!activeConversationId) return;

    // hủy request cũ (nếu có)
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    const fetchMessages = async () => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const res = await apiGet(endpoints.messages.latestMessage, {
          params: {
            conversationId: activeConversationId,
            partnerId: activeConversation.partnerId,
          },
          signal: controller.signal,
        });

        const { messages, oldestCursor, latestCursor } = res.data.data;
        // console.log(res.data.data);
        setOldestCursor(oldestCursor);
        setLatestCursor(latestCursor);

        const grouped = groupMessagesByDate(normalizeMessages(messages, myId));

        setMessages(grouped);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    return () => {
      controller.abort(); // cleanup khi unmount / deps change
    };
  }, [activeConversationId]);

  return {
    messages,
    loading,
    loadMoreOldestMessage,
    oldestCursor,
    latestCursor,
    setLatestCursor,
    setMessages,
    sendMessage,
    addNewMessageToGroupedMessages,
  };
};
