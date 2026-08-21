import styles from "../../assets/styles/ResultModal.module.css";

function ResultModal({ title, icon, children, actions }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.children}>{children}</div>

      <div className={styles.footer}>{actions}</div>
    </div>
  );
}

export default ResultModal;
