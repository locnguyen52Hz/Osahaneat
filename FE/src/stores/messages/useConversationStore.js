import { create } from "zustand";
import { api } from "../../api/api";
import endpoints from "../../api/endpoints";
import {
  groupMessagesByDate,
  mergeGroupedMessages,
  normalizeMessages,
} from "../../util/message";
import { useAuthStore } from "../Auth/useAuthStore";
import { v4 } from "uuid";
import { classifyApiError } from "../../util/apiError";
import axios from "axios";

// thêm message realtime đã xong

//  buffer: đưa message vào pendingMessagesByConversation chưa làm
// chưa clear buffer khi merge message

export const useConversationStore = create((set, get) => ({
  conversationIds: [],
  conversationMap: {},
  isLoadingConversations: false,
  totalUnreadCount: 0,
  activeConversationId: null,
  messagesByConversation: {},
  pendingMessagesByConversation: {},

  /* ================= Conversations ================= */
  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await api.get(`${endpoints.messages.conversation}?page=0`);

      const conversationList = res.data.data;

      const ids = conversationList.map((c) => c.id);

      const map = {};
      for (const c of conversationList) {
        map[c.id] = c;
      }
      set({ conversationIds: ids });
      set({ conversationMap: map });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  /* ================= Messages ================= */

  sendMessage: async (newMessage) => {
    const state = get();
    const conversationId = state.activeConversationId;
    const conversation = state.conversationMap[conversationId];

    if (!conversation || !newMessage.trim()) return;

    const mySequence = conversation.clientSequence.mySequence;
    const clientSequence = mySequence != null ? mySequence + 1 : 1;

    const msgBody = {
      partnerId: conversation.partnerId,
      content: newMessage.trim(),
      clientSequence,
      sentAt: new Date().toISOString(),
      clientMessageId: v4(),
    };

    const optimisticMessage = {
      ...msgBody,
      id: `temp-${msgBody.clientMessageId}`,
      senderId: useAuthStore.getState().myId,
      isMine: true,
      readAt: null,
      createdAt: msgBody.sentAt,
      status: "sending",
      conversationId,
    };

    set((state) =>
      state.addOptimisticMessage(
        state,
        conversationId,
        optimisticMessage,
        clientSequence,
      ),
    );

    try {
      const res = await api.post(endpoints.messages.send, msgBody);
      const sentMessage = res.data.data;

      set((state) =>
        state.updateMessage(
          state,
          sentMessage.conversationId,
          msgBody.clientMessageId,
          (targetMessage) => ({
            ...targetMessage,
            ...sentMessage,
            status: "sent",
          }),
        ),
      );
    } catch (error) {
      const errorInfo = classifyApiError(error);

      set((state) =>
        state.updateMessage(
          state,
          conversationId,
          msgBody.clientMessageId,
          (targetMessage) => ({
            ...targetMessage,
            status: errorInfo.status,
            retryCount: errorInfo.retryable && 0,
          }),
        ),
      );
    }
  },

  retrySendMessage: async (failedMessage) => {
    console.log(failedMessage);
    if (failedMessage.status !== "failed" || failedMessage.retryCount >= 3)
      return;

    const retryCount = failedMessage.retryCount + 1;

    set((state) =>
      state.updateMessage(
        state,
        failedMessage.conversationId,
        failedMessage.clientMessageId,
        (targetMessage) => {
          return {
            ...targetMessage,
            retryCount,
            status: "sending",
          };
        },
        ["failed"],
      ),
    );

    const { clientSequence, content, sentAt, clientMessageId, partnerId } =
      failedMessage;

    const retryMessage = {
      clientSequence,
      content,
      sentAt,
      clientMessageId,
      partnerId,
    };

    try {
      const res = await api.post(endpoints.messages.send, retryMessage);

      const sentMessage = res.data.data;

      set((state) =>
        state.updateMessage(
          state,
          sentMessage.conversationId,
          clientMessageId,
          (targetMessage) => ({
            ...targetMessage,
            ...sentMessage,
            status: "sent",
          }),
        ),
      );
    } catch (error) {
      const errorInfo = classifyApiError(error);

      set((state) =>
        state.updateMessage(
          state,
          failedMessage.conversationId,
          clientMessageId,
          (targetMessage) => ({
            ...targetMessage,
            retryCount,
            status: errorInfo.status,
          }),
        ),
      );
    }
  },

  fetchLatestMessages: async (conversationId, partnerId) => {
    const state = get();

    // nếu đã có data rồi thì không fetch lại (cache)
    if (state.messagesByConversation[conversationId]?.groupedMessages?.length) {
      return;
    }

    // set loading cho conversation này
    set((prev) => ({
      messagesByConversation: {
        ...prev.messagesByConversation,
        [conversationId]: {
          ...prev.messagesByConversation[conversationId],
          isLoading: true,
        },
      },
    }));

    try {
      const res = await api.get(endpoints.messages.latestMessage, {
        params: { conversationId, partnerId },
      });

      const { messages, oldestCursor, latestCursor } = res.data.data;
      // console.log(res.data.data);

      const myId = useAuthStore.getState().myId;

      const grouped = groupMessagesByDate(normalizeMessages(messages, myId));

      set((prev) => ({
        messagesByConversation: {
          ...prev.messagesByConversation,
          [conversationId]: {
            groupedMessages: grouped,
            oldestCursor,
            latestCursor,
            hasMore: !!oldestCursor,
            isLoading: false,
          },
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      set((prev) => ({
        messagesByConversation: {
          ...prev.messagesByConversation,
          [conversationId]: {
            ...prev.messagesByConversation[conversationId],
            isLoading: false,
          },
        },
      }));
    }
  },

  loadMoreOldestMessage: async (conversationId) => {
    const state = get();
    if (!conversationId) return;

    const conversationData = state.messagesByConversation[conversationId];
    if (
      !conversationData ||
      conversationData.isLoading ||
      !conversationData.hasMore
    )
      return;

    const partnerId = state.conversationMap[conversationId]?.partnerId;
    if (!partnerId) return;

    // Set loading true cho conversation này
    set((prev) => ({
      messagesByConversation: {
        ...prev.messagesByConversation,
        [conversationId]: {
          ...prev.messagesByConversation[conversationId],
          isLoading: true,
        },
      },
    }));

    const body = {
      conversationId,
      partnerId,
      messageCursor: conversationData.oldestCursor,
    };
    // console.log(body);

    try {
      const res = await api.post(endpoints.messages.olderMessages, body);
      const { messages, oldestCursor } = res.data?.data;
      if (!res.data?.data) return;

      const myId = useAuthStore.getState().myId;

      const grouped = groupMessagesByDate(normalizeMessages(messages, myId));

      //prepend message cũ
      set((prev) => ({
        messagesByConversation: {
          ...prev.messagesByConversation,
          [conversationId]: {
            // giữ lại state cũ của conversation hiện tại
            ...prev.messagesByConversation[conversationId],
            groupedMessages: mergeGroupedMessages(
              prev.messagesByConversation[conversationId].groupedMessages,
              grouped,
              "prepend",
            ),
            //  Cập nhật cursor mới
            oldestCursor,

            //Xác định còn tin nhắn để load nữa hay không
            hasMore: !!oldestCursor,
          },
        },
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set((prev) => ({
        messagesByConversation: {
          ...prev.messagesByConversation,
          [conversationId]: {
            ...prev.messagesByConversation[conversationId],
            isLoading: false,
          },
        },
      }));
    }
  },

  setMessages: (conversationId, groupedMessages, oldestCursor, latestCursor) =>
    set((prev) => ({
      messagesByConversation: {
        ...prev.messagesByConversation,
        [conversationId]: {
          ...prev.messagesByConversation[conversationId],
          groupedMessages,
          oldestCursor,
          latestCursor,
        },
      },
    })),

  onIncomingMessage: (message) => {
    set((state) => {
      const conversationId = message.conversationId;
      const isActive = conversationId === state.activeConversationId;

      const hasFetched = !!state.messagesByConversation[conversationId];

      // ===== 1. HANDLE MESSAGE DETAIL =====
      let updatedMessagesByConversation = state.messagesByConversation;

      let updatedPending = state.pendingMessagesByConversation;

      if (!hasFetched) {
        //  chưa fetch → buffer
        const pending =
          state.pendingMessagesByConversation[conversationId] || [];

        // tránh duplicate trong buffer
        const exists = pending.some((m) => m.id === message.id);
        if (!exists) {
          updatedPending = {
            ...state.pendingMessagesByConversation,
            [conversationId]: [...pending, message],
          };
          console.log(updatedPending);
        }
      } else {
        //  đã fetch → append realtime
        const conversation = state.messagesByConversation[conversationId];
        const groups = conversation.groupedMessages || [];

        const lastIndex = groups.length - 1;
        const lastGroup = groups[lastIndex];
        console.log(lastGroup);

        const date = new Date(message.createdAt);
        const dateKey = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        // tránh duplicate trong UI
        const alreadyExists = groups.some((g) =>
          g.messages.some((m) => m.id === message.id),
        );

        if (!alreadyExists) {
          let newGroups;

          if (lastGroup && lastGroup.createdAt === dateKey) {
            const updatedLastGroup = {
              ...lastGroup,
              messages: [...lastGroup.messages, message],
            };

            newGroups = [...groups];
            newGroups[lastIndex] = updatedLastGroup;
          } else {
            newGroups = [
              ...groups,
              {
                createdAt: dateKey,
                messages: [message],
              },
            ];
          }

          updatedMessagesByConversation = {
            ...state.messagesByConversation,
            [conversationId]: {
              ...conversation,
              groupedMessages: newGroups,
              latestCursor: {
                createdAt: message.createdAt,
                id: message.id,
              },
            },
          };
        }
      }

      // ===== 2. HANDLE CONVERSATION LIST =====
      const conversation = state.conversationMap[conversationId];

      if (!conversation) return state;

      const updatedConversation = {
        ...conversation,
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
        unreadCount: conversation.unreadCount + 1,
        senderName: message.senderName,
        senderId: message.senderId,
      };

      return {
        messagesByConversation: updatedMessagesByConversation,
        pendingMessagesByConversation: updatedPending,

        conversationMap: {
          ...state.conversationMap,
          [conversationId]: updatedConversation,
        },

        conversationIds: [
          updatedConversation.id,
          ...state.conversationIds.filter((id) => id !== conversationId),
        ],

        totalUnreadCount: state.totalUnreadCount + 1,
      };
    });
  },

  clearPendingMessages: (conversationId) =>
    set((state) => ({
      pendingMessagesByConversation: {
        ...state.pendingMessagesByConversation,
        [conversationId]: [],
      },
    })),

  ensureConversationExists: (message) =>
    set((state) => {
      const { conversationId } = message;

      // console.log("check", conversationId);

      if (state.conversationMap[conversationId]) {
        // console.log("conversation already exists");
        return {};
      }

      const newConversation = {
        id: conversationId,
        partnerId: message.senderId,
        senderName: message.senderName,
        partnerName: message.senderName,
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
        readAt: null,
        unreadCount: 1,
      };

      // console.log(newConversation);

      return {
        conversationIds: [newConversation.id, ...state.conversationIds],
        conversationMap: {
          ...state.conversationMap,
          [conversationId]: newConversation,
        },
      };
    }),

  markMessagesAsRead: async (conversationId, readUpToMsg) => {
    if (!readUpToMsg) return;
    console.log("run:", readUpToMsg);
    const state = get();
    const conv = state.messagesByConversation[conversationId];

    if (!conv) return;
    set((prev) => {
      /* ===== Update conversationMap ===== */
      const newConversationMap = { ...prev.conversationMap };

      if (newConversationMap[conversationId]) {
        newConversationMap[conversationId] = {
          ...newConversationMap[conversationId],
          // unreadCount: conversationUnreadCount,
        };
      }

      /* ===== Update groupedMessages ===== */
      const updatedGroupedMessages = prev.messagesByConversation[
        conversationId
      ].groupedMessages.map((group) => ({
        ...group,
        messages: group.messages.map((msg) => {
          if (
            !msg.isMine &&
            msg.readAt == null &&
            msg.clientSequence >= readUpToMsg.minClientSequence &&
            msg.clientSequence <= readUpToMsg.maxClientSequence
          ) {
            return {
              ...msg,
              readAt: readUpToMsg.lastSeenAt,
            };
          }
          return msg;
        }),
      }));

      return {
        // totalUnreadCount,
        conversationMap: newConversationMap,

        messagesByConversation: {
          ...prev.messagesByConversation,
          [conversationId]: {
            ...prev.messagesByConversation[conversationId],
            groupedMessages: updatedGroupedMessages,
          },
        },
      };
    });

    const markReadMessage = { ...readUpToMsg, conversationId };

    try {
      const res = await api.patch(
        endpoints.messages.markUpMessages,
        markReadMessage,
      );

      const { conversationUnreadCount, totalUnreadCount } = res.data.data;
      set((prev) => {
        const newConversationMap = { ...prev.conversationMap };
        if (newConversationMap[conversationId]) {
          newConversationMap[conversationId] = {
            ...newConversationMap[conversationId],
            unreadCount: conversationUnreadCount,
          };
        }
        return {
          conversationMap: newConversationMap,
          totalUnreadCount,
        };
      });

      console.log(conversationUnreadCount, totalUnreadCount);
    } catch (error) {
      console.log(error);
    }
  },

  /* ================= Unread ================= */
  fetchUnreadMessage: async () => {
    try {
      const res = await api.get(endpoints.messages.countUnreadMessage);

      set({ totalUnreadCount: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  updateUnreadStats: (stats) =>
    set((prevState) => {
      const { conversationId, conversationUnreadCount, totalUnreadCount } =
        stats;

      //clone conversationMap
      const newMap = { ...prevState.conversationMap };

      //update conversation hiện tại
      if (newMap[conversationId]) {
        newMap[conversationId] = {
          ...newMap[conversationId],
          unreadCount: conversationUnreadCount,
        };
      }

      return {
        conversationMap: newMap,
        totalUnreadCount: totalUnreadCount,
      };
    }),

  increaseUnreadCount: (conversationId) => {
    set((state) => {
      const newMap = { ...state.conversationMap };

      if (newMap[conversationId]) {
        newMap[conversationId] = {
          ...newMap[conversationId],
          unreadCount: (newMap[conversationId].unreadCount || 0) + 1,
        };
      }

      return {
        totalUnreadCount: state.totalUnreadCount + 1,
        conversationMap: newMap,
      };
    });
  },

  /* ================= helper ================= */
  updateMessage: (
    state,
    conversationId,
    clientMessageId,
    updater,
    allowedStatuses = ["sending"],
  ) => {
    const conversationData = state.messagesByConversation[conversationId];

    if (!conversationData) return {};

    const groupedMessages = [...conversationData.groupedMessages];

    for (let i = groupedMessages.length - 1; i >= 0; i--) {
      const messageIndex = groupedMessages[i].messages.findIndex(
        (msg) => msg.clientMessageId === clientMessageId,
      );

      if (messageIndex === -1) continue;

      const targetGroup = groupedMessages[i];
      const updatedMessages = [...targetGroup.messages];
      const targetMessage = updatedMessages[messageIndex];

      if (!allowedStatuses.includes(targetMessage.status)) {
        console.log("return");
        return {};
      }

      updatedMessages[messageIndex] = updater(targetMessage);

      groupedMessages[i] = {
        ...targetGroup,
        messages: updatedMessages,
      };

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: {
            ...conversationData,
            groupedMessages,
          },
        },
      };
    }

    return {};
  },

  addOptimisticMessage: (
    state,
    conversationId,
    optimisticMessage,
    clientSequence,
  ) => {
    const conversationData = state.messagesByConversation[conversationId];

    if (!conversationData) return {};

    const groupedMessages = [...conversationData.groupedMessages];

    const groupDate = new Date(optimisticMessage.createdAt).toLocaleDateString(
      "vi-VN",
    );

    const lastIndex = groupedMessages.length - 1;
    const lastGroup = groupedMessages[lastIndex];

    if (lastGroup?.createdAt === groupDate) {
      groupedMessages[lastIndex] = {
        ...lastGroup,
        messages: [...lastGroup.messages, optimisticMessage],
      };
    } else {
      groupedMessages.push({
        createdAt: groupDate,
        messages: [optimisticMessage],
      });
    }

    return {
      conversationMap: {
        ...state.conversationMap,
        [conversationId]: {
          ...state.conversationMap[conversationId],
          clientSequence: {
            ...state.conversationMap[conversationId].clientSequence,
            mySequence: clientSequence,
          },
          lastMessage: optimisticMessage.content,
          lastMessageAt: optimisticMessage.sentAt,
        },
      },
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: {
          ...conversationData,
          groupedMessages,
        },
      },
    };
  },
}));
