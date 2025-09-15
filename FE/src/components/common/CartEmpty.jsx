import React from 'react'
import style from '../../assets/styles/CartEmpty.module.css'

function CartEmpty() {
  return (
    <div className={style.imageWrapper}>
      <img src="/empty-cart.png" alt="" />
    </div>
  )
}

export default CartEmpty
