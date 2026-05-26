import React from "react";
import "./Modal.css";

function AddToCartModal({ isOpen, onClose, product, onAddToCart }) {
  if (!isOpen) return null;

  const handleAdd = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Thêm vào giỏ hàng</h2>
        </div>
        <div className="modal-body">
          <img
            src={product.image}
            alt={product.name}
            className="modal-product-image"
          />
          <div className="modal-product-info">
            <h3>{product.name}</h3>
            <p className="modal-price">{product.price}₫</p>
            <label>Số lượng:</label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="modal-quantity"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="modal-btn confirm" onClick={handleAdd}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
