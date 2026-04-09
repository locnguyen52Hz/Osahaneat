import React, { createContext, useContext, useState, useCallback } from "react";
import Modal from "../components/Modal";
import { v4 as uuidv4 } from "uuid";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([]);

  const openModal = useCallback((content, props = {}) => {
    const id = uuidv4(); // ID duy nhất cho modal
    setModalStack((prev) => [...prev, { id, content, props }]);

    // return id; // trả về ID để đóng modal theo ID nếu cần
  });

  const closeModal = useCallback((id) => {
    setModalStack((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeTopModal = useCallback(() => {
    setModalStack((prev) => prev.slice(0, -1));
  }, []);

  const closeAllModal = () => {
    setModalStack([]);
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, closeTopModal, closeAllModal }}
    >
      {children}
      {modalStack.map((modal, index) => (
        <Modal
          key={modal.id}
          isOpen={true}
          closeAllModal={closeAllModal}
          onClose={() => closeModal(modal.id)}
          zIndex={1000 + index} // modal sau nằm trên modal trước
          {...modal.props}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
