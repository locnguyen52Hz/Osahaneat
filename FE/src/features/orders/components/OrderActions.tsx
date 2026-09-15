import { OrderActionsProps } from "../../../types/order/OrderActionsProps";

function OrderActions({
  action,
  label,
  color,
  backGroundColor,
  icon,
  border,
}: OrderActionsProps) {
  // console.log(cancelBtn);
  return (
    <>
      <div>
        {/* Nút cập nhật trạng thái */}
        {label && (
          <button
            style={{
              padding: "12px",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              width: "100%",
              border: border ?? "1px solid transparent",
              color: color ? color : "white",
              backgroundColor: backGroundColor ? backGroundColor : "#d32f2f",
            }}
            onClick={() => action()}
          >
            <i style={{ marginRight: "5px" }} className={icon}></i>
            {label}
          </button>
        )}
      </div>
    </>
  );
}

export default OrderActions;
