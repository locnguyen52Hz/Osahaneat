import { useEffect } from "react";
import styles from "../../../assets/styles/MessagesPage.module.css";
import { useConversationStore } from "../../../stores/messages/useConversationStore";
import Conversation from "../../messages/components/Conversation";
import ConversationDetails from "../../messages/components/ConversationDetails";

function MessagesPage() {
  const conversationList = useConversationStore((s) => s.conversationList);
  const messagesByConversation = useConversationStore(
    (s) => s.messagesByConversation,
  );
  const conversationMap = useConversationStore((s) => s.conversationMap);
  const isLoadingConversations = useConversationStore(
    (s) => s.isLoadingConversations,
  );
  const fetchConversations = useConversationStore((s) => s.fetchConversations);
  const pendingMessagesByConversation = useConversationStore(
    (s) => s.pendingMessagesByConversation,
  );

  const activeConversationId = useConversationStore(
    (s) => s.activeConversationId,
  );
  const setActiveConversation = useConversationStore(
    (s) => s.setActiveConversation,
  );
  console.log("messagesByConversation: ", messagesByConversation);
  console.log("pendingMessagesByConversation: ", pendingMessagesByConversation);

  useEffect(() => {
    fetchConversations();
    const sentAt = new Date().toISOString();

    console.log(sentAt);
    // 2026-09-29T11:51:13.902Z
  }, []);

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
