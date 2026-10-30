import React from 'react';

export const CartItemsList: React.FC = () => {
  return (
    <div className="cart-items-container">
      <div className="empty-cart-view">
        <span className="empty-icon">🛒</span>
        <p className="empty-text">Your cart is empty</p>
        <p className="empty-subtext">Add products from the catalog to see them here.</p>
      </div>
    </div>
  );
};
