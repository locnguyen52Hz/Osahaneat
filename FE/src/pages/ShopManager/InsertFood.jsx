import React, { useRef, useState } from "react";
import styles from "../../assets/styles/InsertFood.module.css";
import EditAbleText from "../../components/EditableText";
import FloatingLabel from "../../components/common/FloatingLabel";
import { MAX_LENGTH_NOTE } from "../../constants/limits";
import shared from '../../assets/styles/Shared.module.css'

function InsertFood({ onSubmitNewFood }) {
  const [newFood, setNewFood] = useState({
    name: "",
    description: "",
    price: "",
    image: null, // file thực
    preview: "", // url preview
  });


  const handleChange = (field, value) => {
    setNewFood((prev) => ({ ...prev, [field]: value }));
  };

  const imageRef = useRef(null);
  const handleClick = () => {
    imageRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setNewFood((prev) => ({
      ...prev,
      image: file, // file thực
      preview: previewUrl, // chỉ dùng để hiển thị
    }));
  };

  const handleSubmit = () => {
    const foodToSubmit = {
      name : newFood.name,
      description : newFood.description,
      price: newFood.price,
      image : newFood.image
    }
    onSubmitNewFood(foodToSubmit);
  };

  return (
    <div className={styles.container}>
      <h1>New Food</h1>
      <div className={styles.body}>
        <div className={styles.image} onClick={handleClick}>
          {!newFood.preview ? (
            <i className="bi bi-image"></i>
          ) : (
            <img src={newFood.preview} alt="preview" />
          )}
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.form}> 
          <FloatingLabel
            label="Tên"
            value={newFood.name}
            onChange={(e) => handleChange("name", e.target.value)}
            maxLength={50}
            
          />
        </div>

        <div className={styles.form}>
          <FloatingLabel
            label="Giá"
            type = 'number'
            maxLength={50}
            value={newFood.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>

        <div className={`${styles.form} ${styles.description}`}>
          <FloatingLabel
            label="Mô tả"
            textarea = 'textarea'
            value={newFood.description}
            onChange={(e) => handleChange("description", e.target.value)}
            maxLength = {MAX_LENGTH_NOTE}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={shared.submitBtn} onClick={handleSubmit}>Insert</button>
      </div>
    </div>
  );
}

export default InsertFood;
