import React from "react";
import shared from "../../assets/styles/Shared.module.css";

export default function FreeShipIcon({ label = "Free delivery" }) {
  return (
    <span
    style={{display:'inline-flex'}}
      className={`${shared.badgeLight} ${shared.badge} `}
    >
      <i style={{ marginRight: "5px" }} className="bi bi-truck"></i>
      <span>{label}</span>
    </span>
  );
}
