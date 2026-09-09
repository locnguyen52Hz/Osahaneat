import endpoints from "../../../api/endpoints";
import { ShopRegisterCredentials } from "../../../types/auth/ShopRegisterCredentials";
import RegisterForm from "../../auth/components/RegisterForm";
import { shopFields } from "../../auth/config/authFields";

function RegisterShop() {
  return (
    <>
      <RegisterForm<ShopRegisterCredentials>
        endpoint={`${endpoints.auth.register}/shop-manager`}
        fields={shopFields}
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
      />
    </>
  );
}

export default RegisterShop;
