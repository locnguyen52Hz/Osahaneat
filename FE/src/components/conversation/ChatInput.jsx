import FloatingLabel from "../../components/common/FloatingLabel";
import styles from "../../assets/styles/ConversationDetails.module.css";
import { sanitizeInput } from "../../util/format";
import { useState } from "react";
import { useConversationMessages } from "../../hooks/useConversationMessages";

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  // console.log(value)

  const send = () => {
    if (!value.trim()) return;
    onSend(sanitizeInput(value));
    setValue("");
  };

  return (
    <div className={styles.footer}>
      <FloatingLabel
        label="Nội dung tin nhắn"
        textarea
        maxLength={500}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div onClick={send} className={styles.sendBtn}>
        <i className="bi bi-send-fill"></i>
      </div>
    </div>
  );
};

export default ChatInput;
