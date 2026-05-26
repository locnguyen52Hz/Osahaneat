function OrderActions({
  action,
  label,
  color,
  backGroundColor,
}) {
  // console.log(cancelBtn);
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {/* Nút cập nhật trạng thái */}
        {label && (
          <button
            style={{
              flex: 2,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%",
              color: color ? color : "white",
              backgroundColor: backGroundColor ? backGroundColor : "#d32f2f",
            }}
            onClick={() => action()}
          >
            {label}
          </button>
        )}
      </div>
    </>
  );
}

export default OrderActions;
