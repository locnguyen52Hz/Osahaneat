import { Link } from "react-router-dom";
import endpoints from "../../../api/endpoints";
import shared from "../../../assets/styles/Shared.module.css";
import RegisterForm from "../../auth/components/RegisterForm";

import { commonFields } from "../../auth/config/authFields";

function Register() {
  return (
    <>
      <RegisterForm
        endpoint={`${endpoints.auth.register}/buyer`}
        fields={commonFields}
        title="Create an account"
        description="Please create an account to continue using our service"
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
