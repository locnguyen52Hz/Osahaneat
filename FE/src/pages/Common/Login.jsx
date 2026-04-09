import AuthForm from "../../components/AuthForm";
import shared from "../../assets/styles/Shared.module.css";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/UseContext";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [externalErrors, setExternalErrors] = useState([]);
  const { login, loading } = useAuth();
 

  const onSubmit = async (data) => {
    const role = await login(data);
    if (!role) return;

    if (role === "ROLE_BUYER" && !loading) {
      // console.log(loading)

      navigate("/buyer/home", { replace: true });
    }
    if (role === "ROLE_SHOP_MANAGER" && !loading) {
      // console.log(loading)
      navigate("/manager/dashboard", { replace: true });
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
          <button className={shared.submitBtn}>Sign in</button>
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
