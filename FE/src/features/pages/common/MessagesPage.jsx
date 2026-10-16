import { useEffect } from "react";
import styles from "../../../assets/styles/MessagesPage.module.css";
import { useConversationStore } from "../../../stores/messages/useConversationStore";
import Conversation from "../../messages/components/Conversation";
import ConversationDetails from "../../messages/components/ConversationDetails";

function MessagesPage() {
  const conversationIds = useConversationStore((s) => s.conversationIds);
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
  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <>
      <p className={styles.title}>Messages</p>
      <div className={styles.container}>
        <div className={styles.child}>
          {!isLoadingConversations &&
            conversationIds.map((id) => {
              const conversation = conversationMap[id];

              return (
                <Conversation
                  key={id}
                  conversation={conversation}
                  onClick={() => setActiveConversation(conversation.id)}
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
