import { Link } from "react-router-dom";
import endpoints from "../../../api/endpoints";
import shared from "../../../assets/styles/Shared.module.css";
import RegisterForm from "../../auth/components/RegisterForm";
import { commonFields, shopFields } from "../../auth/config/authFields";

const test = {
  email: "ducloc96225@gmail.com",
  fullName: "Lộc Nguyễn",
  descriptionRole: "Quản lí cửa hàng\t",
  shopRegisterInfo: {
    shopName: "Toi Dasiun",
  },
};

function RegisterShop() {
  return (
    <>
      <RegisterForm
        endpoint={`${endpoints.auth.register}/shop-manager`}
        fields={[...commonFields, ...shopFields]}
        title="Create an account"
        description="Please create an account to continue using our service"
        transformData={(data) => {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (key === "shopImage") {
              formData.append(key, value[0]);
            } else {
              formData.append(key, value);
            }
          });
          return formData;
        }}
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

export default RegisterShop;
