import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultModal from "../../../components/common/ResultModal";
import RegistrationResult from "../../../components/RegistrationResult";
import { useModal } from "../../../contexts/ModalContext";
import { flattenObject } from "../../../util/objectUtils";
import AuthForm from "./AuthForm";

function RegisterForm({
  endpoint,
  fields,
  title,
  description,
  transformData,
  customFooter,
}) {
  const [externalErrors, setExternalErrors] = useState([]);

  const navigate = useNavigate();
  const { openModal, closeAllModal } = useModal();

  const redirect = () => {
    closeAllModal();
    navigate("/login");
  };

  const onSubmit = async (data) => {
    console.log(data);
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
      setExternalErrors(error.response.data.errors);

      return false;
    }
  };

  return (
    <AuthForm
      title={title}
      description={description}
      fields={fields}
      onSubmit={onSubmit}
      externalErrors={externalErrors}
      customFooter={customFooter}
    />
  );
}

export default RegisterForm;
