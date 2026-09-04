import styles from "../../assets/styles/ResultModal.module.css";

function ResultModal({ title, children, actions, onClose }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.children}>{children} </div>

      <div className={styles.footer}>
        <button onClick={() => actions()} className={styles.redirect}>
          Đến trang đăng nhập <i className="bi bi-box-arrow-in-right"></i>
        </button>
        <button onClick={() => onClose()} className={styles.close}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default ResultModal;
