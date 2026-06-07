import GeographyIcon from "./GeographyIcon";
import styles from "../../assets/styles/LocationDisplay.module.css";

function LocationDisplay({
  distance,
  address,
  format,
  layout = "flex", // "flex" | "block"
  className = "",
}) {
  const containerClass = `
    ${styles.location}
    ${layout === "block" ? styles.block : styles.flex}
    ${className}
  `;

  return (
    <div className={containerClass}>
      <GeographyIcon number={format ? format(distance) : distance} />
      {address && <p>{address}</p>}
    </div>
  );
}

export default LocationDisplay;
