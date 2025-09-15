import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import style from "../assets/styles/Modal.module.css";
import {MODAL_ANIMATION_DURATION} from '../constants'

function Modal({ isOpen, onClose, closeAllModal, children, zIndex, type }) {
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

    // Nếu modal đang trong trạng thái đóng, bỏ qua
    if (closing) return;

    setClosing(true);

    // Hẹn giờ gọi onClose sau 300ms (thời gian animation)
    const timeoutId = setTimeout(() => {
      onClose();
    }, MODAL_ANIMATION_DURATION);

    // Dọn dẹp timeout khi component unmount
    return () => clearTimeout(timeoutId);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`${style.modalOverlay} `} style={{ zIndex }}>
      <div
        className={`${style.modalContent} ${
          closing ? style.slideOut : style.slideIn
        }`}
        style={{ zIndex: zIndex + 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {type === "mycart" && (
            <i className="bi bi-backspace" onClick={handleClose}></i>
          )}

          <i
            className={`bi bi-x-square ${style.closeBtn}`}
            onClick={closeAllModal}
          ></i>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
