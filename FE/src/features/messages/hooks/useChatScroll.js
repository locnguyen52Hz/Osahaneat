import { useEffect, useState } from "react";

export function useChatScroll(elRef, threshold = 20) {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const updateState = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;

      const hasOverflow = scrollHeight > clientHeight;
      setCanScroll(hasOverflow);

      if (!hasOverflow) {
        setIsAtTop(false);
        setIsAtBottom(true);
        return;
      }

      setIsAtTop(scrollTop <= threshold);
      setIsAtBottom(
        scrollTop + clientHeight >= scrollHeight - threshold
      );
    };

    // scroll event
    const handleScroll = () => {
      updateState();
    };

    el.addEventListener("scroll", handleScroll);

    // ResizeObserver (detect content change)
    const observer = new ResizeObserver(() => {
      updateState();
    });

    observer.observe(el);

    // chạy 1 lần khi mount
    updateState();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [elRef, threshold]);

  const onScrollToBottom = () => {
    const el = elRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    setIsAtBottom(true);
  };

  return { isAtTop, isAtBottom, canScroll, onScrollToBottom };
}