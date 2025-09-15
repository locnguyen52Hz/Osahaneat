import React from "react";
import shared from "../assets/styles/Shared.module.css";
import style from "../assets/styles/ShopCard.module.css";
import FreeShipIcon from "../components/common/FreeShipIcon";
import SHOP_DETAIL_STYLE from "../assets/styles/ShopDetail.module.css";

function ShopCard({ shop, urlAvatar, onClick, type }) {
  // console.log(shop);
  return (
    <>
      {type === "featuredShops" ? (
        //default style
        <div className={`${style.card} ${shared.boxShadow}`} onClick={onClick}>
          <div className={`${style.shopAvatarPadding}  ${shared.bgLight}`}>
            <img
              className={`${style.shopAvatar}`}
              src={`${urlAvatar}/${shop.shopAvatar}`}
              alt={shop.shopName}
            />
          </div>

          <div className={style.shopDesc}>
            <h3 className={`${shared.h4}  ${style.textMb}`}>{shop.shopName}</h3>

            <p
              className={`${shared.textDark} ${shared.fontWeightBold}  ${style.textMb}`}
            >
              <i className={` ${shared.textWarning} bi bi-star-fill`}></i>
              {shop.rating || 0}
            </p>

            <div>
              {shop.freeShip || <FreeShipIcon />}
              {/* <span>km</span> */}
            </div>

            {type === "detail" && (
              <p className={style.description}>{shop.description}</p>
            )}
          </div>
        </div>
      ) : (
        //shop detail style
        <div className={`${SHOP_DETAIL_STYLE.header}`} >
          <img
            className={`${SHOP_DETAIL_STYLE.avatar} ${shared.boxShadow}`}
            src={`${urlAvatar}/${shop.shopAvatar}`}
            alt={shop.shopName}
          />
          <div>
            <h3
              className={`${shared.fontWeightBold}  ${SHOP_DETAIL_STYLE.shopName}`}
            >
              {shop.shopName}
            </h3>

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
              <p className={SHOP_DETAIL_STYLE.description}>
                {shop.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ShopCard;
