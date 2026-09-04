import styles from "../assets/styles/RegistrationResult.module.css";
import { registrationFieldLabels } from "../constants/fieldLabels";

function RegistrationResult({ userInfo }) {
  return (
    <div className={styles.fieldContainer}>
      {Object.entries(userInfo).map(([key, value]) => (
        <div key={key} className={styles.field}>
          <p className={styles.key}>{registrationFieldLabels[key]}</p>
          <p className={styles.value}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export default RegistrationResult;
