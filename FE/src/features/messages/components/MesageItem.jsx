import { memo, useEffect, useRef } from "react";
import styles from "../../../assets/styles/ConversationDetails.module.css";
import { formatTime } from "../../../util/format";
import { useConversationStore } from "../../../stores/messages/useConversationStore";

function MessageItem({ msg, observeMessage }) {
  const ref = useRef(null);
  useEffect(() => {
    observeMessage(ref.current);
  }, []);

  const retrySendMessage = useConversationStore((s) => s.retrySendMessage);
  const retryable = msg.status === "failed" && msg.retryCount < 3;
  console.log(retryable);
  return (
    <div
      className={`${styles.message} ${
        msg.isMine ? styles.mine : styles.partner
      }`}
    >
      <div className={styles.content}>
        {retryable && (
          <p onClick={() => retrySendMessage(msg)} className={styles.retry}>
            <i className="bi bi-arrow-clockwise"></i>
          </p>
        )}
        <p
          data-id={msg.id}
          data-is-mine={msg.isMine}
          data-client-sequence={msg.clientSequence}
          data-read-at={msg.readAt}
          className={msg.isMine ? styles.mineContent : styles.partnerContent}
          ref={ref}
        >
          {msg.content}
        </p>
      </div>
      <div
        className={`${styles.metadata} ${
          msg.isMine ? styles.mine : styles.partner
        } `}
      >
        {msg.status === "sending" && (
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
        )}
        {msg.status === "failed" && (
          <i className={`bi bi-exclamation-circle ${styles.error}`}></i>
        )}
        <p>{formatTime(msg.sentAt)}</p>
      </div>
    </div>
  );
}

export default memo(MessageItem);
