// chuẩn hóa tin nhắn,
export const normalizeMessages = (rawMessage, myId) => {
  // console.log(myId)
  return rawMessage
    .map((msg) => ({
      ...msg,
      isMine: msg.senderId === myId, //đánh dấu tin nhắn của user theo id,
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); //sắp xếp theo thứ tự thời gian
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
  const merged = [...prev]; // copy array

  incoming.forEach(({ createdAt, messages }) => {
    if (!Array.isArray(messages)) return;

    const index = merged.findIndex((item) => item.createdAt === createdAt);

    if (index === -1) {
      // chưa tồn tại date
      const newItem = {
        createdAt,
        messages: [...messages],
      };

      mode === "prepend"
        ? merged.unshift(newItem) // ngày cũ hơn → cho lên đầu
        : merged.push(newItem); // ngày mới → cho xuống cuối
    } else {
      // đã tồn tại date
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
