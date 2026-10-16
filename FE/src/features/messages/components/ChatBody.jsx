import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import MessageGroup from "./MessageGroup";
import { useChatScroll } from "../hooks/useChatScroll";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import styles from "../../../assets/styles/ConversationDetails.module.css";
import { createScrollIdleHandler } from "../../../util/util";
import { useConversationStore } from "../../../stores/messages/useConversationStore";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const mockMarkMessagesAsRead = async (
  conversationId,
  { minClientSequence, maxClientSequence },
) => {
  console.log("[API] Bắt đầu request:", {
    minClientSequence,
    maxClientSequence,
    time: new Date().toLocaleTimeString(),
  });

  await delay(5000);

  console.log("[API] Request thành công:", {
    minClientSequence,
    maxClientSequence,
    time: new Date().toLocaleTimeString(),
  });

  return { success: true };
};
const ChatBody = forwardRef(({ messages, loading, conversationId }, ref) => {
  const markMessagesAsRead = useConversationStore((s) => s.markMessagesAsRead);
  const minClientSequenceRef = useRef(null);
  const maxClientSequenceRef = useRef(null);
  const initialScroll = useRef(false);

  // const lastRequestedRangeRef = useRef(null);
  const inFlightRangeRef = useRef(null);
  const sendAgainRef = useRef(false);

  const { isAtTop, canScroll } = useChatScroll(ref);

  const prevScrollHeight = useRef(0);

  const observerRef = useRef(null);

  const scrollIdleHandlerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      scrollIdleHandlerRef.current?.();
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtTop && canScroll && !loading) {
      prevScrollHeight.current = ref.current.scrollHeight;
    }
  }, [isAtTop]);

  useLayoutEffect(() => {
    initialScroll.current = false;
  }, [conversationId]);

  useEffect(() => {
    const handler = createScrollIdleHandler(() => {
      sendReadReq();
    });

    scrollIdleHandlerRef.current = handler;

    return () => {
      handler.cancel();

      if (scrollIdleHandlerRef.current === handler) {
        scrollIdleHandlerRef.current = null;
      }

      minClientSequenceRef.current = null;
      maxClientSequenceRef.current = null;
    };
  }, [conversationId, markMessagesAsRead]);

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

  const sendReadReq = async () => {
    if (inFlightRangeRef.current !== null) {
      sendAgainRef.current = true;
      return;
    }

    const min = minClientSequenceRef.current;
    const max = maxClientSequenceRef.current;

    if (min === null || max === null) return;

    const requestedRange = { min, max };
    inFlightRangeRef.current = requestedRange;
    let requestSucceeded = false;

    try {
      await markMessagesAsRead(conversationId, {
        minClientSequence: requestedRange.min,
        maxClientSequence: requestedRange.max,
        lastSeenAt: new Date().toISOString(),
      });

      requestSucceeded = true;
      const newMin = minClientSequenceRef.current;

      if (newMin < requestedRange.min) {
        maxClientSequenceRef.current = requestedRange.min - 1;
      } else {
        minClientSequenceRef.current = null;
        maxClientSequenceRef.current = null;
      }
    } catch (error) {
      console.log(error);
    } finally {
      inFlightRangeRef.current = null;
      const shouldSendAgain = requestSucceeded && sendAgainRef.current;
      sendAgainRef.current = false;

      if (shouldSendAgain) {
        sendReadReq();
      }
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { dataset } = entry.target;

          const isRead = Boolean(dataset.readAt);
          const isMine = dataset.isMine === "true";
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio >= 0.7;

          if (!isVisible || isRead || isMine) return;

          const sequence = Number(dataset.clientSequence);

          const currentMin = minClientSequenceRef.current;
          const currentMax = maxClientSequenceRef.current;

          const nextMin =
            currentMin === null ? sequence : Math.min(currentMin, sequence);

          const nextMax =
            currentMax === null ? sequence : Math.max(currentMax, sequence);

          if (nextMin === currentMin && nextMax === currentMax) {
            return;
          }

          minClientSequenceRef.current = nextMin;
          maxClientSequenceRef.current = nextMax;

          console.log("[Observer] Range tích lũy:", {
            min: minClientSequenceRef.current,
            max: maxClientSequenceRef.current,
          });
        });
      },
      {
        root: ref.current,
        threshold: 0.7,
      },
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const observeMessage = (element) => {
    if (element) {
      observerRef.current?.observe(element);
    }
  };
  return (
    <div ref={ref} className={styles.body}>
      <div className={styles.chatContent}>
        {messages?.map((group) => (
          <MessageGroup
            key={group.createdAt}
            group={group}
            observeMessage={observeMessage}
          />
        ))}
      </div>
    </div>
  );
});

export default ChatBody;
