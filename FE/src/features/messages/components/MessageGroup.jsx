import MessageItem from "./MesageItem";

import styles from "../../../assets/styles/ConversationDetails.module.css";

const MessageGroup = ({ group, containerRef, onMessageVisible }) => {
  return (
    <div className={styles.chatBox}>
      <div className={styles.dateSeparator}>
        <div className={styles.dash}></div>
        <p>{group.createdAt}</p>
        <div className={styles.dash}></div>
      </div>
      {group.messages.map((msg) => (
        <MessageItem
          key={msg.id}
          msg={msg}
          containerRef={containerRef}
          onMessageVisible={onMessageVisible}
        />
      ))}
    </div>
  );
};

export default MessageGroup;
