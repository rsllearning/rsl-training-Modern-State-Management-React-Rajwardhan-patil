import React from 'react';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose} id="cart-drawer-backdrop">
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        id="cart-drawer-panel"
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-icon">🛍️</span>
            <h3>Shopping Cart</h3>
          </div>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
            id="close-drawer-btn"
          >
            ✕
          </button>
        </div>

        <CartItemsList />
      </div>
    </div>
  );
};
