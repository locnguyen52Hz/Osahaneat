import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import shared from "../../../assets/styles/Shared.module.css";
import { useAuthStore } from "../../../stores/Auth/useAuthStore";

import { FieldErrorMessage } from "../../../types/FieldErrorMessage";
import AuthForm from "../../auth/components/AuthForm";
import { Role } from "../../../enums/Role";
import { LoginCredentials } from "../../../types/auth/LoginCredentials";

function Login() {
  const navigate = useNavigate();
  const [externalErrors, setExternalErrors] = useState<FieldErrorMessage[]>([]);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const onSubmit = async (data: LoginCredentials): Promise<boolean> => {
    if (isLoading) return false;

    setExternalErrors([]);

    try {
      const role = await login(data);

      if (role === Role.BUYER) {
        navigate("/buyer/home", { replace: true });
      }

      if (role === Role.SHOP_MANAGER) {
        navigate("/manager/dashboard", { replace: true });
      }

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setExternalErrors(error.response?.data?.errors ?? []);
      }
      return false;
    }
  };

  return (
    <AuthForm<LoginCredentials>
      externalErrors={externalErrors}
      title="Welcome"
      description="Sign in to your account to continue"
      onSubmit={onSubmit}
      fields={[
        {
          name: "email",
          id: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          type: "email",
          icon: "bi-envelope",
          autoComplete: "email",
          rules: {
            required: { value: true, message: "Không để trống" },
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
              message: "Email không hợp lệ",
            },
          },
        },
        {
          name: "password",

          id: "password",
          label: "Password",
          placeholder: "Enter your password",
          type: "password",
          icon: "bi-eye-slash",
          rules: {
            // value:'toidaidot',
            required: { value: true, message: "Không để trống" },
            pattern: {
              value: /^[A-Za-z\d]{8,72}$/,
              message: "Không dùng ký tự đặc biệt",
            },
          },
        },
      ]}
      submitLabel={"Đăng nhập"}
      options={
        <>
          <Link className={shared.a} to="/register">
            Create an account
          </Link>
          <Link className={shared.a} to="/register-shop">
            Create a shop account
          </Link>
        </>
      }
    />
  );
}

export default Login;
