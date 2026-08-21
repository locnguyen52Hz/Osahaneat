import { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import endpoints from "../api/endpoints";
import shared from "../assets/styles/Shared.module.css";
import styles from "../assets/styles/ShopCard.module.css";
import SHOP_DETAIL_STYLE from "../assets/styles/ShopDetail.module.css";
import LoadingSpinner from "./common/LoadingSpinner";

function UploadAvatar({ initialImage, setShop, editAble = true }) {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);
  const handleClick = () => {
    if (!editAble) return;
    fileRef.current.click();
    console.log(fileRef.current);
  };

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const oldImage = image;
    const tempUrl = URL.createObjectURL(file);
    setImage(tempUrl);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.patch(`${endpoints.shop.updateAvatar}`, formData);

      // Upload thành công → lấy lại thông tin shop thật
      const res = await api.get(`${endpoints.shop.details}`);
      setShop(res.data.data);
    } catch (error) {
      console.error("Upload thất bại:", error);
      setImage(oldImage); // rollback lại ảnh cũ
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div onClick={handleClick} className={styles.wrapperAvatar}>
        {editAble && <div className={styles.overLay}></div>}

        {editAble && <i className="bi bi-camera-fill"></i>}
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <img
              className={`${SHOP_DETAIL_STYLE.avatar} ${shared.boxShadow}`}
              src={image}
              alt="Shop avatar"
            />
          )}
        </div>
      </div>

      {editAble && (
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}
    </>
  );
}

export default UploadAvatar;
