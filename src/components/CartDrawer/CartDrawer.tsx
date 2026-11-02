import React from 'react';
import { CartItemsList } from './CartItemsList';
import { CartErrorBanner } from './CartErrorBanner';
import { CheckoutButton } from './CheckoutButton';
import { selectTotalPrice, useCartStore } from '../../store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const totalPrice = useCartStore(selectTotalPrice);

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

        {/* Decomposed leaf components subscribing granularly to their slices */}
        <CartErrorBanner />
        <CartItemsList />

        <div className="cart-summary-footer">
          <div className="total-row">
            <span className="total-label">Subtotal:</span>
            <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <CheckoutButton />
        </div>
      </div>
    </div>
  );
};
