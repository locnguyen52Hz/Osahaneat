// components/AuthForm.jsx
import { useForm } from "react-hook-form";
import styles from "../assets/styles/AuthForm.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";

export default function AuthForm({ title, description, onSubmit, fields, customFooter, externalErrors  }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();  

  useEffect(() =>{
    if(externalErrors && Array.isArray(externalErrors)){
      externalErrors.forEach((error) =>{
        setError(error.field, {
          type: 'server',
          message : error.message
        })
      })
    }
  },[externalErrors , setError])

  return (
    <div className={styles.pageRegister}>
      <div className={styles.banner}></div>
      <div className={styles.pageLeft}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h3 className={styles.h3}>{title}</h3>
            <p className={styles.paragraph}>{description}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field) => (
              <div className={styles.row} key={field.name}>
                <div className={styles.bgIcon}>
                  <i className={`bi ${field.icon}`} />
                </div>
                <div className={styles.inputContainer}>
                  <label
                    className={`${styles.label} ${styles.titleLabel}`}
                    htmlFor={field.id}
                  >
                    {field.label}
                  </label>
                  <input
                    className={styles.input}
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete || "off"}
                    {...register(field.name, field.rules)}
                  />
                  <p className={styles.error}>
                    {errors[field.name]?.message || (
                      <span style={{ visibility: "hidden" }}>ẩn</span>
                    )}
                  </p>
                </div>
              </div>
            ))}

            {customFooter && <div className={styles.form}>{customFooter}</div>}
          </form>
          
        </div>
      </div>
    </div>
  );
}
