import style from '../../../assets/styles/ShopInfo.module.css'

function ShopInfo({ name, description }) {
  return (
    <>
      <h2 className={style.shopName}>{name}</h2>
      {description && <p className={style.description}>{description}</p>}
    </>
  );
}

export default ShopInfo;