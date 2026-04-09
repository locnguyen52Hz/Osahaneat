import { create } from "zustand";
import { apiGet, apiPatch, apiPost } from "../../api/api";
import endpoints from "../../api/endpoints";
import { useAuthStore } from "../Auth/useAuthStore";
import {
  groupMessagesByDate,
  mergeGroupedMessages,
  normalizeMessages,
} from "../../util/message";


// thêm message realtime đã xong

//  buffer: đưa message vào pendingMessagesByConversation chưa làm
// chưa clear buffer khi merge message

export const useConversationStore = create((set, get) => ({
  conversationList: [],
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
      const res = await apiGet(`${endpoints.messages.conversation}?page=0`);
      // console.log(res.data);
      const list = res.data.data;
      console.log(list)

      const map = {};
      for (const c of list) {
        map[c.id] = c;
      }
      set({ conversationList: list });
      set({ conversationMap: map });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  /* ================= Messages ================= */

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
      const res = await apiGet(endpoints.messages.latestMessage, {
        params: { conversationId, partnerId },
      });

      const { messages, oldestCursor, latestCursor } = res.data.data;

      const myId = useAuthStore.getState().myId;

      const grouped = groupMessagesByDate(normalizeMessages(messages, myId));
      console.log(grouped)

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
    if (!conversationData || !conversationData.hasMore) return;

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
      const res = await apiPost(endpoints.messages.olderMessages, body);
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

  onIncomingMessage: (message) =>
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
        console.log(pending);

        // tránh duplicate trong buffer
        const exists = pending.some((m) => m.id === message.id);
        if (!exists) {
          updatedPending = {
            ...state.pendingMessagesByConversation,
            [conversationId]: [...pending, message],
          };
        }
      } else {
        //  đã fetch → append realtime
        const conversation = state.messagesByConversation[conversationId];
        const groups = conversation.groupedMessages || [];

        const lastIndex = groups.length - 1;
        const lastGroup = groups[lastIndex];
    

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
              hasNewMessage: !message.isMine,
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
        unreadCount: isActive
          ? conversation.unreadCount
          : conversation.unreadCount + 1,
      };

      return {
        messagesByConversation: updatedMessagesByConversation,
        pendingMessagesByConversation: updatedPending,

        conversationMap: {
          ...state.conversationMap,
          [conversationId]: updatedConversation,
        },

        conversationList: [
          updatedConversation,
          ...state.conversationList.filter((c) => c.id !== conversationId),
        ],

        totalUnreadCount: isActive
          ? state.totalUnreadCount
          : state.totalUnreadCount + 1,
      };
    }),

  resetHasNewMessage: (conversationId) => {
    set((state) => {
      const conversation = state.messagesByConversation[conversationId];
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: {
            ...conversation,
            hasNewMessage: false,
          },
        },
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
        console.log("conversation already exists");
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
        conversationList: [newConversation, ...state.conversationList],
        conversationMap: {
          ...state.conversationMap,
          [conversationId]: newConversation,
        },
      };
    }),

  markMessagesAsRead: async (conversationId, readUpToMsg) => {
    if (!readUpToMsg) return;
    const state = get();
    const conv = state.messagesByConversation[conversationId];
    if (!conv) return;

    try {
      const res = await apiPatch(
        endpoints.messages.markUpMessages,
        readUpToMsg,
      );

      const { conversationUnreadCount, totalUnreadCount } = res.data.data;

      set((prev) => {
        /* ===== Update conversationMap ===== */
        const newConversationMap = { ...prev.conversationMap };

        if (newConversationMap[conversationId]) {
          newConversationMap[conversationId] = {
            ...newConversationMap[conversationId],
            unreadCount: conversationUnreadCount,
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
              msg.id >= readUpToMsg.lastSeenMessageId
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
          totalUnreadCount,
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
    } catch (error) {
      console.log(error);
    }
  },

  /* ================= Unread ================= */
  fetchUnreadMessage: async () => {
    try {
      const res = await apiGet(endpoints.messages.countUnreadMessage);
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
}));
