import { useState } from "react";
import { createQuantityRegex } from "../util/regex";


export default function useQuantity(
  min,
  max,
  initialValue = "1"
) {
  const [quantity, setQuantity] = useState(initialValue);

  const regex = createQuantityRegex(min, max);

  const increase = () => {
    const current = Number(quantity);

    if (current < max) {
      setQuantity(String(current + 1));
    }
  };

  const decrease = () => {
    const current = Number(quantity);

    if (current > 0) {
      setQuantity(String(current - 1));
    }
  };

  const handleChange = (value) => {
    if (value === "" || regex.test(value)) {
      setQuantity(value);
    }
  };

  const handleBlur = () => {
    const number = Number(quantity);

    const valid =
      Number.isInteger(number) &&
      number >= min &&
      number <= max;

    if (!valid) {
      setQuantity("0");
    }
  };

  return {
    quantity,
    setQuantity,
    increase,
    decrease,
    handleChange,
    handleBlur,
  };
}