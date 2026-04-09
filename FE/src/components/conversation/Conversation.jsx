import React from "react";
import styles from "../../assets/styles/Conversation.module.css";
import { timeAgo } from "../../util/format";
import { jwtDecode } from "jwt-decode";
// import { useMessagesListStore } from "../../stores/messages/useConversationStore";

function Conversation({ conversation, onClick }) {
  // console.log(conversation)
  const token = localStorage.getItem("token");
  const myId = jwtDecode(token).userID;
  // console.log(useMessagesListStore.getState())
  // console.log(conversation)

  return (
    <div className={styles.wrapperConversation} onClick={onClick}>
      <div className={styles.header}>
        <p className={styles.name}>
          {conversation.partnerName} {conversation.unreadCount ? conversation.unreadCount : ''}
        </p>
        <p className={styles.time}>{timeAgo(conversation.lastMessageAt)}</p>
      </div>
      {myId === conversation.senderId ? (
        <p className={styles.latestMessage}>Bạn: {conversation.lastMessage}</p>
      ) : (
        <p className={styles.latestMessage}>{conversation.lastMessage}</p>
      )}
    </div>
  );
}

export default Conversation;
