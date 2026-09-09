import axios from "axios";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import shared from "../../../assets/styles/Shared.module.css";
import ResultModal from "../../../components/common/ResultModal";
import RegistrationResult from "../../../components/RegistrationResult";
import { useModal } from "../../../contexts/ModalContext";
import { RegisterFormProps } from "../../../types/auth/RegisterFormProps";
import { FieldErrorMessage } from "../../../types/FieldErrorMessage";
import { flattenObject } from "../../../util/objectUtils";
import AuthForm from "./AuthForm";

function RegisterForm<T extends FieldValues>({
  endpoint,
  fields,
  title,
  description,
  transformData,
}: RegisterFormProps<T>) {
  const [externalErrors, setExternalErrors] = useState<FieldErrorMessage[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { openModal, closeAllModal } = useModal();

  const redirect = () => {
    closeAllModal();
    navigate("/login");
  };

  const onSubmit = async (data: T): Promise<boolean> => {
    if (isLoading) return false;
    setIsLoading(true);
    try {
      const requestData = transformData ? transformData(data) : data;

      const res = await axios.post(endpoint, requestData);
      console.log(res.data.data);

      const userInfo = flattenObject(res.data.data);

      openModal(
        <ResultModal
          title="Đăng ký thành công"
          actions={redirect}
          onClose={closeAllModal}
        >
          <RegistrationResult userInfo={userInfo} />
        </ResultModal>,
        { type: "popup" },
      );

      return true;
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        console.log(error)
        setExternalErrors(error.response?.data?.errors ?? []);
      }

      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm<T>
      title={title}
      description={description}
      fields={fields}
      onSubmit={onSubmit}
      externalErrors={externalErrors}
      submitLabel="Tạo tài khoản"
      options={
        <p style={{ textAlign: "center" }} className={shared.paragraph}>
          Already have an account?{" "}
          <Link className={shared.link} to="/login">
            Sign in
          </Link>
        </p>
      }
    />
  );
}

export default RegisterForm;
