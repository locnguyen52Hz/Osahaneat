import React from "react";
import { formatDate, formatTime } from "../../util/format";
import shared from "../../assets/styles/Shared.module.css";

function DateTime({ time }) {
  const styles = {
    wrapper: {
      display: "inline-flex",
      gap: "0.3rem",
      fontSize : '12px'
    },
    p :{
        paddingTop: '1px'
    }
  };
  return (
    <>
      <div className={shared.paragraph} style={{ ...styles.wrapper }}>
        <i className="bi bi-calendar-event"></i>
        <p style={{...styles.p}}>{formatDate(time)}</p>
      </div>
      <div className={shared.paragraph} style={{ ...styles.wrapper }}>
        <i className="bi bi-alarm"></i>
        <p style={{...styles.p}}>{formatTime(time)}</p>
      </div>

    </>
  );
}

export default DateTime;
