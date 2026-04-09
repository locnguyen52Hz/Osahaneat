import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/styles/ConversationDetails.module.css";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useChatScroll } from "../../hooks/useChatScroll";
import ChatBody from "./ChatBody";
import { useConversationMessages } from "../../hooks/useConversationMessages";
import ChatInput from "./ChatInput";
import { createScrollIdleHandler } from "./util";
import { useConversationStore } from "../../stores/messages/useConversationStore";

function ConversationDetails({ conversation }) {
  console.log(conversation)
  const { subscribeMessage } = useWebSocketContext();
  const chatBody = useRef(null);

  const { isAtBottom, isAtTop, onScrollToBottom } = useChatScroll(chatBody);

  const { sendMessage } = useConversationMessages();

  const [hasNewMessage, setHasNewMessage] = useState(false);

  const {
    messagesByConversation,
    activeConversationId,
    isLoadingConversations,
    fetchLatestMessages,
    loadMoreOldestMessage,
    markMessagesAsRead,
    resetHasNewMessage,
  } = useConversationStore();

  const isNewMessage =
    messagesByConversation[conversation.id]?.hasNewMessage || false;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!conversation) return;
    fetchLatestMessages(conversation.id, conversation.partnerId);
  }, [conversation?.id]);

  /* ================= REFS ================= */
  const oldestVisibleMsgCursor = useRef(null);
  const lastMarkedIdRef = useRef(null);

  /* ================= RESET WHEN CHANGE CONVERSATION ================= */
  useEffect(() => {
    oldestVisibleMsgCursor.current = null;
    lastMarkedIdRef.current = null;
  
  }, [conversation.id]);

  /* ================= NEW MESSAGE ================= */
  useEffect(() => {
    if (!isNewMessage) return;

    if (!isAtBottom) {
      setHasNewMessage(true);
      return;
    }

    onScrollToBottom();
    resetHasNewMessage(conversation.id);

    oldestVisibleMsgCursor.current = null;
    lastMarkedIdRef.current = null;
  }, [isNewMessage]);

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
    resetHasNewMessage(conversation.id);

    oldestVisibleMsgCursor.current = null;
    lastMarkedIdRef.current = null;
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.header}>{conversation.partnerName}</div>

      <p onClick={onSeenNewMessage}>{hasNewMessage && "new message"}</p>

      <ChatBody
        ref={chatBody}
        messages={messagesByConversation[activeConversationId]?.groupedMessages}
        conversationId={conversation?.id}
        loading={isLoadingConversations}
        onMessageVisible={onMessageVisible}
        onHandleScrollIdle={handleScrollIdle}
      />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ConversationDetails;
