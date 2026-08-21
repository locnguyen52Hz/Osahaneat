// components/AuthForm.jsx
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../assets/styles/AuthForm.module.css";

export default function AuthForm({
  title,
  description,
  onSubmit,
  fields,
  customFooter,
  externalErrors,
  pathnameUrl,
}) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  console.log(externalErrors);

  useEffect(() => {
    if (externalErrors && Array.isArray(externalErrors)) {
      externalErrors.forEach((error) => {

        setError(error.field, {
          type: "server",
          message: error.message,
        });
      });
    }
  }, [externalErrors, setError]);

  return (
    <div className={styles.pageRegister}>
      <div className={styles.banner}></div>
      {(pathnameUrl === "/login" || pathnameUrl === "/register") && (
        <div className={styles.buyerForm}>
          <div className={styles.container}>
            <div className={styles.title}>
              <h3 className={styles.h3}>{title}</h3>
              <p className={styles.paragraph}>{description}</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              {fields.map((field) => {
                const registration = register(field.name, field.rules);
                // console.log(registration);
                return (
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
                        {...registration}
                        onChange={(e) => {
                          clearErrors(field.name);
                          registration.onChange(e);
                        }}
                      />

                      <p className={styles.error}>
                        {errors[field.name]?.message || (
                          <span style={{ visibility: "hidden" }}>ẩn</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}

              {customFooter && (
                <div className={styles.form}>{customFooter}</div>
              )}
            </form>
          </div>
        </div>
      )}

      {pathnameUrl === "/register-shop" && (
        <div className={styles.buyerForm}>
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
              {customFooter && (
                <div className={styles.form}>{customFooter}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
