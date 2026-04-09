import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import MessageGroup from "./MessageGroup";
import { useChatScroll } from "../../hooks/useChatScroll";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import styles from "../../assets/styles/ConversationDetails.module.css";

const ChatBody = forwardRef(
  (
    { messages, loading, conversationId, onMessageVisible, onHandleScrollIdle, },
    ref,
  ) => {
    const initialScroll = useRef(false);
    const { isAtTop, canScroll } = useChatScroll(ref);
    const prevScrollHeight = useRef(0);

    // console.log("messages: ", messages);

    useEffect(() => {
      if (isAtTop && canScroll && !loading) {
        prevScrollHeight.current = ref.current.scrollHeight;
      }
    }, [isAtTop]);

    useLayoutEffect(() => {
      initialScroll.current = false;
      onHandleScrollIdle.current();
    }, [conversationId]);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const onScroll = () => {
        onHandleScrollIdle.current();
      };

      el.addEventListener("scroll", onScroll);
      return () => el.removeEventListener("scroll", onScroll);
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      /**vừa load thêm tin nhắn cũ (prepend) */
      if (prevScrollHeight.current > 0) {
        const diff = el.scrollHeight - prevScrollHeight.current;
        el.scrollTop += diff;

        prevScrollHeight.current = 0;
        return;
      }

      /** scroll lần đầu của conversation mới */
      if (initialScroll.current) return;

      const hasMessage =
        messages?.length > 0 && messages.some((g) => g.messages?.length > 0);

      if (!hasMessage) return;

      el.scrollTop = el.scrollHeight;
      initialScroll.current = true;
    }, [messages]);

    return (
      <div ref={ref} className={styles.body}>
        {loading ? <LoadingSpinner /> :''}
        {messages?.map((group) => (
          <MessageGroup
            key={group.createdAt}
            group={group}
            containerRef={ref}
            onMessageVisible={onMessageVisible}
          />
        ))}
      </div>
    );
  },
);

export default ChatBody;
