import style from "../../../assets/styles/FoodList.module.css";
import FoodCard from "./FoodCard";

function FoodList({ foods }) {
  return (
    <>
      <div className={style.foodList}>
        {foods?.map((food) => (
          <FoodCard key={food.foodId} food={food} />
        ))}
      </div>
    </>
  );
}

export default FoodList;
