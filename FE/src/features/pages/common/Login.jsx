import { Link, useNavigate } from "react-router-dom";
import shared from "../../../assets/styles/Shared.module.css";
import AuthForm from "../../auth/components/AuthForm";

import { useState } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useAuthStore } from "../../../stores/Auth/useAuthStore";

function Login() {
  const navigate = useNavigate();
  const [externalErrors, setExternalErrors] = useState([]);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const onSubmit = async (data) => {
    if (isLoading) return;

    setExternalErrors([]);
    try {
      const role = await login(data);
      if (role === "ROLE_BUYER") {
        navigate("/buyer/home", { replace: true });
      }
      if (role === "ROLE_SHOP_MANAGER") {
        navigate("/manager/dashboard", { replace: true });
      }
    } catch (error) {
      setExternalErrors(error.response.data.errors);
    }
  };

  return (
    <AuthForm
      pathnameUrl={window.location.pathname}
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
            required: { value: true, message: "Không để trống" },
            pattern: {
              value: /^[A-Za-z\d]{8,72}$/,
              message: "Không dùng ký tự đặc biệt",
            },
          },
        },
      ]}
      customFooter={
        <>
          <button className={shared.submitBtn}>
            {isLoading ? <LoadingSpinner /> : "Sign in"}
          </button>
          <a
            className={shared.paragraph}
            style={{ textAlign: "center" }}
            href=""
          >
            Forgot password?
          </a>
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
