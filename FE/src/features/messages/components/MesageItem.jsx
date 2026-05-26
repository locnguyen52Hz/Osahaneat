import { memo, useEffect, useMemo, useRef, useState } from "react";
import styles from "../../../assets/styles/ConversationDetails.module.css";
import { formatTime } from "../../../util/format";
// import { debounce } from "./util";

function MessageItem({ msg, containerRef, onMessageVisible }) {
  const ref = useRef(null);
  // const minVisibleCursorRef = useRef(msg.id);
  // console.log(containerRef);

  // const [boundingClientRect, setBoundingClientRect] = useState(0);
  // console.log(msg)
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && msg.readAt === null && !msg.isMine) {
          const visibleMessageCursor = {
            lastSeenMessageId: msg.id,
            lastSeenAt: new Date().toISOString(),
            conversationId: msg.conversationId,
            readAt: msg.readAt,
          };
          // console.log(visibleMessageCursor)
          onMessageVisible(visibleMessageCursor);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.7,
      },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [msg.id]);

  return (
    <div
      className={`${styles.message} ${
        msg.isMine ? styles.mine : styles.partner
      }`}
    >
      <p
        className={msg.isMine ? styles.mineContent : styles.partnerContent}
        ref={ref}
      >
        {msg.content}
        <br />
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
