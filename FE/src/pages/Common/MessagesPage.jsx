import React, { useEffect, useState } from "react";
import Conversation from "../../components/conversation/Conversation";
import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import ConversationDetails from "../../components/conversation/ConversationDetails";
import styles from "../../assets/styles/MessagesPage.module.css";
import { useWebSocketContext } from "../../contexts/WebSocketContext";
import { useConversationStore } from "../../stores/messages/useConversationStore";

function MessagesPage() {
  const conversationList = useConversationStore((s) => s.conversationList);
  const conversationMap = useConversationStore((s) => s.conversationMap);
  const isLoadingConversations = useConversationStore(
    (s) => s.isLoadingConversations,
  );
  const fetchConversations = useConversationStore((s) => s.fetchConversations);
  const handleIncomingMessage = useConversationStore(
    (s) => s.handleIncomingMessage,
  );
  const activeConversationId = useConversationStore(
    (s) => s.activeConversationId,
  );
  const setActiveConversation = useConversationStore(
    (s) => s.setActiveConversation,
  );
  // console.log(conversationMap);
  useEffect(() => {
    fetchConversations();
  }, []);

  /* ================= WebSocket listener ================= */

  const { subscribeMessage } = useWebSocketContext();

  // useEffect(() => {
  //   const unsubscribe = subscribeMessage((msg) => {
  //     handleIncomingMessage(msg, activeConversationId);
  //   });
  //   console.log(unsubscribe)

  //   return unsubscribe;
  // }, [subscribeMessage, activeConversationId]);

  return (
    <>
      <p className={styles.title}>Messages</p>
      <div className={styles.container}>
        <div className={styles.child}>
          {!isLoadingConversations &&
            conversationList.map((c) => {
              const latest = conversationMap[c.id] || c;

              return (
                <Conversation
                  key={c.id}
                  conversation={latest}
                  onClick={() => setActiveConversation(latest.id)}
                />
              );
            })}
        </div>
        <div className={styles.child}>
          {activeConversationId ? (
            <ConversationDetails
              key={activeConversationId}
              conversation={conversationMap[activeConversationId]}
            />
          ) : (
            "chọn "
          )}
        </div>
      </div>
    </>
  );
}

export default MessagesPage;
