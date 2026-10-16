import MessageItem from "./MesageItem";

import styles from "../../../assets/styles/ConversationDetails.module.css";

const MessageGroup = ({ group, observeMessage }) => {
  // console.log(group)
  return (
    <div className={styles.messageGroup}>
      <div className={styles.dateSeparator}>
        <div className={styles.dash}></div>
        <p>{group.createdAt}</p>
        <div className={styles.dash}></div>
      </div>
      {group.messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} observeMessage={observeMessage} />
      ))}
    </div>
  );
};

export default MessageGroup;
