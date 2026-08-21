import styles from "../../../assets/styles/Conversation.module.css";
import { useAuthStore } from "../../../stores/Auth/useAuthStore";
import { timeAgo } from "../../../util/format";
// import { useMessagesListStore } from "../../stores/messages/useConversationStore";

function Conversation({ conversation, onClick }) {
  // if (conversation.unreadCount === undefined) {
  //   console.log(conversation);
  // }

  const myId = useAuthStore((s) => s.myId);

  return (
    <div className={styles.wrapperConversation} onClick={onClick}>
      <div className={styles.avatar}>
        <i className="bi bi-person-circle"></i>
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{conversation.partnerName}</p>
        {myId === conversation.senderId ? (
          <p className={styles.latestMessage}>
            Bạn: {conversation.lastMessage}
          </p>
        ) : (
          <p className={styles.latestMessage}>{conversation.lastMessage}</p>
        )}
      </div>
      <div className={styles.count}>
        <p className={styles.time}>{timeAgo(conversation.lastMessageAt)}</p>
        {conversation.unreadCount ? (
          <p className={styles.badge}>{conversation.unreadCount}</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Conversation;
