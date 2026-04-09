import AuthForm from "../../components/AuthForm";
import shared from "../../assets/styles/Shared.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import endpoints from "../../api/endpoints";

function Register() {
  const navigate = useNavigate();
  const [externalErrors, setExternalErrors] = useState([]);

  const onSubmit = (data) => {
    console.log("Đăng ký:", data);
    // gọi API đăng ký tại đây

    axios({
      method: "post",
      url: `${endpoints.auth.register}/buyer`,
      data: {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (res) {
        console.log(res);
        if (res.data) {
          navigate("/login");
        }
      })
      .catch(function (error) {
        const response = error.response?.data?.errorMessages || [];
        setExternalErrors(response);
      });
  };

  return (
    <>
      <AuthForm
        pathnameUrl={window.location.pathname}
        externalErrors={externalErrors}
        title="Create an account"
        description="Please create an account to continue using our service"
        onSubmit={onSubmit}
        fields={[
          {
            name: "fullName",
            id: "full-name",
            label: "Full Name",
            placeholder: "Enter your name",
            type: "text",
            icon: "bi-person",
            rules: {
              required: { value: true, message: "Không để trống" },
              maxLength: { value: 50, message: "Tối đa 50 ký tự" },
              minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
              pattern: {
                value: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Tên không chứa ký tự đặc biệt hoặc số",
              },
            },
          },
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
                value:
                  /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
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
              minLength: { value: 8, message: "Tối thiểu 8 ký tự" },
              maxLength: { value: 72, message: "Tối đa 72 ký tự" },
              pattern: {
                value: /^[A-Za-z\d]{8,72}$/,
                message: "Không dùng ký tự đặc biệt",
              },
            },
          },
        ]}
        customFooter={
          <>
            <button className={shared.submitBtn}>Create an account</button>
            <p style={{ textAlign: "center" }} className={shared.paragraph}>
              Already have an account?{" "}
              <Link className={shared.link} to="/login">
                Sign in
              </Link>
            </p>
          </>
        }
      />
    </>
  );
}

export default Register;
