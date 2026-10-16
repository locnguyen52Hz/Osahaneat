// chuẩn hóa tin nhắn,
export const normalizeMessages = (rawMessage, myId) => {
  return rawMessage
    .map((msg) => ({
      ...msg,
      isMine: msg.senderId === myId,
    }))
    .sort((a, b) => {
      const sentAt = new Date(a.sentAt) - new Date(b.sentAt);

      if (sentAt !== 0) return sentAt;

      if (a.clientSequence !== b.clientSequence) {
        return a.clientSequence - b.clientSequence;
      }

      return a.id - b.id;
    });
};

//nhóm tin nhắn theo ngày
export const groupMessagesByDate = (messages) => {
  const groups = [];

  messages.forEach((msg) => {
    const createdAt = new Date(msg.createdAt).toLocaleDateString("vi-VN");

    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.createdAt === createdAt) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({
        createdAt,
        messages: [msg],
      });
    }
  });

  return groups;
};

// thêm tin nhắn vào state
export const mergeGroupedMessages = (prev, incoming, mode = "append") => {
  const merged = [...prev];

  const items = mode === "prepend" ? [...incoming].reverse() : incoming;

  items.forEach(({ createdAt, messages }) => {
    if (!Array.isArray(messages)) return;

    const index = merged.findIndex((item) => item.createdAt === createdAt);

    if (index === -1) {
      const newItem = {
        createdAt,
        messages: [...messages],
      };

      mode === "prepend" ? merged.unshift(newItem) : merged.push(newItem);
    } else {
      merged[index] = {
        ...merged[index],
        messages:
          mode === "prepend"
            ? [...messages, ...merged[index].messages]
            : [...merged[index].messages, ...messages],
      };
    }
  });

  return merged;
};
