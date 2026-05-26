import React, { useRef, useState } from "react";
import endpoints from "../../api/endpoints";
import EditAbleText from "../../components/EditableText";
import shared from "../../assets/styles/Shared.module.css";
import FloatingLabel from "../../components/common/FloatingLabel";
import styles from "../../assets/styles/InsertFood.module.css";
import { useModal } from "../../contexts/ModalContext";
import PopupComfirm from "../../components/common/PopupComfirm";

function EditFood({ food, onSubmitEditFood, onDeleteFood }) {
  const [foodDetail, setFoodDetail] = useState(food);
  const { openModal } = useModal();
  const fileRef = useRef(null);
  const handleClick = () => {
    fileRef.current.click();
  };

  console.log(foodDetail)
  const handleOnchange = (field, value) => {
    setFoodDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewImage = URL.createObjectURL(file);
    setFoodDetail((prev) => ({ ...prev, image: file, previewImage }));
  };

  const handleSubmitEdit = () => {
    // console.log(foodDetail.previewImage);
    onSubmitEditFood(foodDetail);
  };
  return (
    <div className={styles.container}>
      <h1>Edit food</h1>
      <div className={styles.body}>
        <div className={styles.image} onClick={() => handleClick()}>
          {foodDetail.previewImage ? (
            <img src={foodDetail.previewImage} />
          ) : (
            <img src={`${endpoints.image.food}/${foodDetail.image}`} />
          )}
        </div>

        <div className={styles.form}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <FloatingLabel
            label="Name"
            value={foodDetail.name}
            maxLength={50}
            onChange={(e) => handleOnchange("name", e.target.value)}
          />
        </div>

        <div className={styles.form}>
          {" "}
          <FloatingLabel
            label="Giá"
            type="number"
            maxLength={50}
            value={foodDetail.price}
            onChange={(e) => handleOnchange("price", Number(e.target.value))}
          />
        </div>

        <div className={styles.form}>
          <FloatingLabel
            label="Description"
            value={foodDetail.description}
            maxLength={250}
            onChange={(e) => handleOnchange("description", e.target.value)}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.deleteBtn}
          onClick={() =>
            openModal(
              <PopupComfirm
                label={`Xóa "${foodDetail.name}"`}
                message="Không thể khôi phục"
                icon={<i className="bi bi-trash3-fill"></i>}
                actionType='delete'
                onComfirm = {onDeleteFood}
                data={foodDetail.foodId}
              />,
              { type: "popup"}
            )
          }
        >
          <i className={`bi bi-trash3-fill `}></i>
        </button>
        <button
          onClick={() => handleSubmitEdit()}
          className={`${shared.submitBtn} ${styles.submitBtn}`}
        >
          Comfirm
        </button>
      </div>
    </div>
  );
}

export default EditFood;
