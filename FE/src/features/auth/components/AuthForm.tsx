import { useEffect } from "react";
import {
  FieldPath,
  FieldValues,
  get,
  useForm
} from "react-hook-form";
import styles from "../../../assets/styles/AuthForm.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { AuthFormProps } from "../../../types/auth/AuthFormProps";

export default function AuthForm<T extends FieldValues>({
  title,
  description,
  onSubmit,
  fields,
  submitLabel,
  externalErrors,
  options,
}: AuthFormProps<T>) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>();

  useEffect(() => {
    if (!Array.isArray(externalErrors)) return;

    externalErrors.forEach((error) => {
      setError(error.field as FieldPath<T>, {
        type: "server",
        message: error.message,
      });
    });
  }, [externalErrors, setError]);

  const handleFormSubmit = async (data: T) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <div className={styles.pageRegister}>
      <div className={styles.banner}></div>
      <div className={styles.buyerForm}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h3 className={styles.h3}>{title}</h3>
            <p className={styles.paragraph}>{description}</p>
          </div>
          <form
            className={styles.form}
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            {fields.map((field) => {
              const registration = register(field.name, field.rules);
              return (
                <fieldset
                  disabled={isSubmitting}
                  className={styles.row}
                  key={field.name}
                >
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
                      accept={field.accept}
                      {...registration}
                      onChange={(e) => {
                        clearErrors(field.name);
                        registration.onChange(e);
                      }}
                    />
                    <p className={styles.error}>
                      {get(errors, field.name)?.message || (
                        <span style={{ visibility: "hidden" }}> ẩn </span>
                      )}
                    </p>
                  </div>
                </fieldset>
              );
            })}

            <div className={styles.form}>
              <button disabled={isSubmitting} className={shared.submitBtn}>
                {isSubmitting ? <LoadingSpinner /> : submitLabel}
              </button>
              {options && options}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
