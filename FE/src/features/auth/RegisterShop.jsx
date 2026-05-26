import { Link } from "react-router-dom";
import AuthForm from "../../components/AuthForm";
import shared from "../../assets/styles/Shared.module.css";
import axios from "axios";
import endpoints from "../../api/endpoints";

function RegisterShop() {
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${endpoints.auth.register}/shop-manager`,
        {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          shopName: data.shopName,
          description: data.description,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Đăng ký thành công:", res.data);
    } catch (error) {
      console.error("Lỗi đăng ký:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <AuthForm
        onSubmit={onSubmit}
        pathnameUrl={window.location.pathname}
        title="Create a shop account"
        description="Please create an account to continue using our service"
        fields={[
          {
            name: "fullName",
            id: "full-name",
            label: "Full Name",
            placeholder: "Enter your name",
            type: "text",
            icon: "bi bi-person",
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
            icon: "bi bi-envelope",
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
            icon: "bi bi-eye-slash",
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
          {
            name: "shopName",
            id: "shop-name",
            label: "Shop name",
            placeholder: "Enter your shop name",
            type: "text",
            icon: "bi bi-shop-window",
            rules: {
              required: { value: true, message: "Không để trống" },
              minLength: { value: 3, message: "Tối thiểu 3 ký tự" },
              maxLength: { value: 72, message: "Tối đa 72 ký tự" },
              pattern: {
                value: /^[A-Za-zÀ-ỹ0-9\s]+$/,
                message: "Không chứa ký tự đặc biệt",
              },
            },
          },
          {
            name: "description",
            id: "description",
            label: "Description",
            placeholder: "Enter your shop description",
            type: "text",
            icon: "bi bi-file-text",
            rules: {
              maxLength: { value: 200, message: "Tối đa 200 ký tự" },
              pattern: {
                value: /^[A-Za-zÀ-ỹ0-9\s.,!?"'()-]+$/,
                message: "Không chứa ký tự đặc biệt nguy hiểm",
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
    </div>
  );
}

export default RegisterShop;
