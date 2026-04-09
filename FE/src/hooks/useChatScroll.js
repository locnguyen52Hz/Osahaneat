import React, { useEffect, useState } from "react";

export function useChatScroll(elRef, threshold = 20) {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  // console.log(elRef.current?.scrollTop);

  const onScrollToBottom = () => {
    const el = elRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    setIsAtBottom(true);
  };

  useEffect(() => {
    const el = elRef.current;

    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;

      const hasOverflow = scrollHeight > clientHeight; // nếu scrollHeight > clientHeight => element đã có scroll
      setCanScroll(hasOverflow);

      if (!hasOverflow) {
        // Không đủ nội dung để scroll → bỏ qua
        setIsAtTop(false);
        setIsAtBottom(true);
        return;
      }

      setIsAtTop(scrollTop <= threshold);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - threshold);
    };

    el.addEventListener("scroll", handleScroll);
    // requestAnimationFrame(handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return { isAtTop, isAtBottom, canScroll, onScrollToBottom };
}
