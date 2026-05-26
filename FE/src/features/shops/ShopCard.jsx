import React from "react";
import shared from "../../assets/styles/Shared.module.css";
import style from "../../assets/styles/ShopCard.module.css";
import FreeShipIcon from "../../components/common/FreeShipIcon";
import SHOP_DETAIL_STYLE from "../../assets/styles/ShopDetail.module.css";
import { formatDistance } from "../../util/format.js";
import GeographyIcon from "../../components/common/GeographyIcon.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import EditAbleText from "../../components/EditAbleText.jsx";
import UploadAvatar from "../../components/UploadAvatar.jsx";
import endpoints from "../../api/endpoints.js";

function ShopCard({ shop, onClick, type, handleChange, setShop }) {
  const role = localStorage.getItem("role");
  const isEditAble = role === "ROLE_SHOP_MANAGER";
  // console.log(shop);
  return (
    <>
      {type === "card" ? (
        //default style
        <div className={`${style.card} ${shared.boxShadow}`} onClick={onClick}>
          <div className={`${style.shopAvatarPadding}  ${shared.bgLight}`}>
            <img
              className={`${style.shopAvatar}`}
              src={`${endpoints.image.shop}/${shop.shopAvatar}`}
              alt={shop.name}
            />
          </div>

          <div className={style.shopDesc}>
            <h3 className={`${shared.h4}  ${style.textMb}`}>{shop.name}</h3>

            <p
              className={`${shared.textDark} ${shared.fontWeightBold}  ${style.shopName}`}
            >
              <i className={` ${shared.textWarning} bi bi-star-fill`}></i>
              {shop.rating || 0}
            </p>
            <p>{shop.address}</p>

            <div>
              {/* {shop.freeShip || <FreeShipIcon />} */}
              {shop.distance ? (
                <GeographyIcon number={formatDistance(shop.distance)} />
              ) : (
                <LoadingSpinner />
              )}

              {/* <span>km</span> */}
            </div>

            {type === "detail" && (
              <p className={style.description}>{shop.description}</p>
            )}
          </div>
        </div>
      ) : (
        //shop detail style
        <div className={`${SHOP_DETAIL_STYLE.header}`}>
          <UploadAvatar
            editAble={isEditAble}
            initialImage={`${endpoints.image.shop}/${shop.shopAvatar}`}
            setShop={setShop}
          />

          <div className={style.content}>
            <EditAbleText
              as="h3"
              value={shop.name}
              editAble={isEditAble}
              tagClass={`${shared.fontWeightBold} ${SHOP_DETAIL_STYLE.shopName} ${SHOP_DETAIL_STYLE.tag}`}
              fieldClass={`${shared.fontWeightBold} ${SHOP_DETAIL_STYLE.shopName} ${SHOP_DETAIL_STYLE.input}`}
              onChange={(newValue) => handleChange("name", newValue)}
            />

            <p
              className={`${shared.textDark} ${shared.fontWeightBold}  ${SHOP_DETAIL_STYLE.textMb}`}
            >
              <i className={` ${shared.textWarning} bi bi-star-fill`}></i>
              {shop.rating || 0}
            </p>

            <div>
              {shop.freeShip || <FreeShipIcon />}
              {/* <span>km</span> */}
            </div>

            {type === "detail" && (
              <EditAbleText
                as="p"
                value={shop.description}
                editAble={isEditAble}
                textArea={true}
                tagClass={`${shared.paragraphColor} ${SHOP_DETAIL_STYLE.tag}`}
                fieldClass={`${shared.paragraphColor} ${SHOP_DETAIL_STYLE.textArea}`}
                onChange={(newValue) => handleChange("description", newValue)}
                multiline={true}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ShopCard;
