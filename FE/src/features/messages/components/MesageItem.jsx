import { memo, useEffect, useRef } from "react";
import styles from "../../../assets/styles/ConversationDetails.module.css";
import { formatTime } from "../../../util/format";

function MessageItem({ msg, observeMessage }) {
  const ref = useRef(null);

  useEffect(() => {
    observeMessage(ref.current);
  }, []);

  return (
    <div
      className={`${styles.message} ${
        msg.isMine ? styles.mine : styles.partner
      }`}
    >
      <p
        data-id={msg.id}
        data-is-mine={msg.isMine}
        data-client-sequence={msg.clientSequence}
        data-read-at={msg.readAt}
        className={msg.isMine ? styles.mineContent : styles.partnerContent}
        ref={ref}
      >
        {msg.id}
        <br />
        {msg.content}
      </p>
      <p
        className={`${styles.createdAt} ${
          msg.isMine ? styles.mine : styles.partner
        } `}
      >
        {formatTime(msg.createdAt)}
      </p>
    </div>
  );
}

export default memo(MessageItem);
