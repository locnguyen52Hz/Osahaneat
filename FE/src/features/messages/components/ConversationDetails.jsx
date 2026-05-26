import React, { useEffect, useRef, useState } from "react";
import styles from "../../../assets/styles/ConversationDetails.module.css";
import { useWebSocketContext } from "../../../contexts/WebSocketContext";
import { useChatScroll } from "../hooks/useChatScroll";
import ChatBody from "./ChatBody";
import { useConversationMessages } from "../../messages/hooks/useConversationMessages";
import ChatInput from "./ChatInput";
import { createScrollIdleHandler } from "../../../util/util";
import { useConversationStore } from "../../../stores/messages/useConversationStore";
import { useAuthStore } from "../../../stores/Auth/useAuthStore";

function ConversationDetails({ conversation }) {
  const chatBody = useRef(null);
  const { isAtBottom, isAtTop, onScrollToBottom, canScroll } =
    useChatScroll(chatBody);

  // const { sendMessage } = useConversationMessages();
  const authStore = useAuthStore.getState();
  authStore.loadUserFromToken();
  const myId = authStore.myId;

  const [hasNewMessage, setHasNewMessage] = useState(false);

  const {
    messagesByConversation,
    activeConversationId,
    isLoadingConversations,
    fetchLatestMessages,
    loadMoreOldestMessage,
    markMessagesAsRead,
    conversationMap,
    sendMessage,
  } = useConversationStore();

  const lastMessageId = useConversationStore((s) => {
    const groups = s.messagesByConversation[conversation.id]?.groupedMessages;

    if (!groups || groups.length === 0) return null;

    const lastGroup = groups[groups.length - 1];
    if (!lastGroup.messages || lastGroup.messages.length === 0) return null;

    const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];

    return lastMessage.id;
  });
  // console.log(conversationMap);

  useEffect(() => {
    if (!lastMessageId || !canScroll) return;
    if (isAtBottom) {
      onScrollToBottom();
    }
    if (!isAtBottom && canScroll && myId !== conversation.senderId) {
      setHasNewMessage(true);
    }
  }, [lastMessageId, conversation.id, canScroll]);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!conversation || !myId) return;
    fetchLatestMessages(conversation.id, conversation.partnerId);
  }, [conversation.id, myId]);

  /* ================= REFS ================= */
  const oldestVisibleMsgCursor = useRef(null);
  const lastMarkedIdRef = useRef(null);

  /* ================= RESET WHEN CHANGE CONVERSATION ================= */
  useEffect(() => {
    oldestVisibleMsgCursor.current = null;
    lastMarkedIdRef.current = null;
  }, [conversation.id]);

  /* ================= LOAD MORE ================= */
  useEffect(() => {
    if (
      isAtTop &&
      messagesByConversation[activeConversationId]?.oldestCursor &&
      !isLoadingConversations
    ) {
      loadMoreOldestMessage(conversation.id);
    }
  }, [isAtTop]);

  /* ================= SCROLL IDLE (CALL API HERE) ================= */
  const handleScrollIdle = useRef(
    createScrollIdleHandler(() => {
      const cursor = oldestVisibleMsgCursor.current;
      if (!cursor) return;

      // tránh call lại cùng 1 message
      if (lastMarkedIdRef.current === cursor.lastSeenMessageId) return;

      markMessagesAsRead(conversation?.id, cursor);

      lastMarkedIdRef.current = cursor.lastSeenMessageId;
    }, 500),
  );

  /* ================= DETECT MESSAGE VISIBLE ================= */
  const onMessageVisible = (visibleMessage) => {
    const current = oldestVisibleMsgCursor.current;


    // chọn message có id nhỏ nhất (cũ nhất trong viewport)
    if (
      !current ||
      visibleMessage.lastSeenMessageId < current.lastSeenMessageId
    ) {
      oldestVisibleMsgCursor.current = visibleMessage;
    }

    // trigger debounce
    handleScrollIdle.current();
  };

  /* ================= CLICK NEW MESSAGE ================= */
  const onSeenNewMessage = () => {
    onScrollToBottom();
    setHasNewMessage(false);

    oldestVisibleMsgCursor.current = null;
    lastMarkedIdRef.current = null;
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.header}>{conversation.partnerName}</div>

      <ChatBody
        ref={chatBody}
        messages={messagesByConversation[activeConversationId]?.groupedMessages}
        conversationId={conversation?.id}
        loading={isLoadingConversations}
        onMessageVisible={onMessageVisible}
        onHandleScrollIdle={handleScrollIdle}
      />

      <ChatInput
        onSend={sendMessage}
        hasNewMessage={hasNewMessage}
        onSeenNewMessage={onSeenNewMessage}
      />
    </div>
  );
}

export default ConversationDetails;
