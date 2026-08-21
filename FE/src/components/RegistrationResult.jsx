function RegistrationResult({ userInfo }) {
  return (
    <div>
      {Object.entries(userInfo).forEach(([key, value]) => {
        <div>
          <p>
            {key} : {value}
          </p>
        </div>;
      })}
    </div>
  );
}

export default RegistrationResult;
