import { Link } from "react-router-dom";
import endpoints from "../../../api/endpoints";
import shared from "../../../assets/styles/Shared.module.css";
import RegisterForm from "../../auth/components/RegisterForm";

import { buyerCommonFields } from "../../auth/config/authFields";
import { BuyerRegisterCredentials } from "../../../types/auth/BuyerRegisterCredentials";

function Register() {
  return (
    <>
      <RegisterForm<BuyerRegisterCredentials>
        endpoint={`${endpoints.auth.register}/buyer`}
        fields={buyerCommonFields}
        title="Create an account"
        description="Please create an account to continue using our service"
      />
    </>
  );
}

export default Register;
