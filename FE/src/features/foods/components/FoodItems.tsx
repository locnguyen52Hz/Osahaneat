import styles from "../../../assets/styles/FoodItems.module.css";
import shared from "../../../assets/styles/Shared.module.css";
import { FoodItemsProps } from "../../../types/food/FoodItemsProps";
import { formatCurrency } from "../../../util/format";

function FoodItems({ listItem }: FoodItemsProps) {
  return (
    <>
      {listItem.map((food) => (
        <div className={styles.foodItem} key={food.foodId}>
          <p
            className={`${styles.quantity} 
           ${shared.bgLight}`}
          >
            {food.quantity}
          </p>
          <p className={styles.foodName}>{food.foodName}</p>
          <p className={styles.price}>{formatCurrency(food.price)}</p>
        </div>
      ))}
    </>
  );
}

export default FoodItems;
