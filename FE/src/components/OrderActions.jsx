import shared from "../assets/styles/Shared.module.css";

function OrderActions({ action, cancelBtn = true, label, cancelOrder }) {
  // console.log(cancelBtn);
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        {/* Nút hủy */}
        {cancelBtn && (
          <button
            style={{ flex: 1 }}
            className={`${shared.cancelBtn}`}
            onClick={() => cancelOrder()}
          >
            Cancel order
          </button>
        )}

        {/* Nút cập nhật trạng thái */}
        {label && (
          <button
            style={{ flex: 2 }}
            className={shared.submitBtn}
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
