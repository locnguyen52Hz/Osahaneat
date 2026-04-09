import React, { useEffect, useRef, useState } from "react";
import styles from "../assets/styles/EditAble.module.css";

function EditAbleText({
  as: Tag = "span",
  value,
  onChange,
  editAble = true,
  textArea = false,
  fieldClass = "",
  type = "text",
  tagClass = "",
  multiline = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const textRef = useRef(null);

  const handleClick = () => {
    if (!editAble) return;
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onChange?.(tempValue);
    }
  };

  // 🔹 Auto resize ngay khi giá trị thay đổi
  useEffect(() => {
    if (textArea && textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [tempValue]);

  // 🔹 Auto resize NGAY KHI VÀO CHẾ ĐỘ EDIT
  useEffect(() => {
    if (isEditing && textArea && textRef.current) {
      requestAnimationFrame(() => {
        textRef.current.style.height = "auto";
        textRef.current.style.height = textRef.current.scrollHeight + "px";
      });
    }
  }, [isEditing, textArea]);
  const handleKeyDown = (e) => {
    if (!textArea && e.key === "Enter") {
      e.target.blur();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        textArea && multiline ? (
          <textarea
            ref={textRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`${styles.editInput} ${fieldClass}`}
            rows={1}
            maxLength={255}
           
          />
        ) : (
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`${styles.editInput} ${fieldClass}`}
          />
        )
      ) : (
        <Tag onClick={handleClick} className={`${styles.editableText} ${tagClass}`}>
          {value}
          {editAble && <i className="bi bi-pencil-square ms-2"></i>}
        </Tag>
      )}
    </>
  );
}

export default EditAbleText;
