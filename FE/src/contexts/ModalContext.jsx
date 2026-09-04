import { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "../components/Modal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalStack, setModalStack] = useState([]);

  const openModal = useCallback((content, props = {}) => {
    const id = uuidv4(); // ID duy nhất cho modal
    setModalStack((prev) => [...prev, { id, content, props }]);

    return id; // trả về ID để đóng modal theo ID nếu cần
  });

  const closeModal = useCallback((id) => {
    setModalStack((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeTopMostModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const closeAllModal = () => {
    console.log("close all");
    setModalStack([]);
  };

  const closeModalWithDelay = useCallback((id, delay) => {
    setTimeout(() => {
      setModalStack((prev) => prev.filter((m) => m.id !== id));
    }, delay);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModal,
        closeModalWithDelay,
        closeTopMostModal,
        modalStack,
      }}
    >
      {children}
      {modalStack.map((modal, index) => (
        <Modal
          key={modal.id}
          isOpen={true}
          onClose={() => closeTopMostModal()}
          onCloseAll={() => closeAllModal()}
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
