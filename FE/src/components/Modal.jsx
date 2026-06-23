import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import style from "../assets/styles/Modal.module.css";
import { MODAL_ANIMATION_DURATION } from "../constants";

function Modal({ isOpen, onClose, children, zIndex, type }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) setClosing(false);
    // (tuỳ chọn) khoá scroll nền khi mở modal
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

const handleClose = (e) => {
  e?.stopPropagation?.();

  if (closing) return;

  setClosing(true);

  setTimeout(() => {
    onClose();
  }, 300); // bằng thời gian animation
};


  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`${style.modalOverlay} `}
      style={{ zIndex }}
      onClick={() => handleClose()}
    >
      {type === "slide" && (
        <div
          className={`${style.modalContent} ${
            closing ? style.slideOut : style.slideIn
          }`}
          style={{ zIndex: zIndex + 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <i
              className={`bi bi-x-square ${style.closeBtn}`}
              onClick={handleClose}
            ></i>
          </div>
          {children}
        </div>
      )}
      {type === "popup" && <div className={style.popup}>{children}</div>}
    </div>,
    document.body,
  );
}

export default Modal;
