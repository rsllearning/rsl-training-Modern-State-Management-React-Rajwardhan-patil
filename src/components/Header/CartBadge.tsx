import React from 'react';
import { useCartState } from '../../context/CartContext';

interface CartBadgeProps {
  onClick: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  const { items } = useCartState();

  // compute total items count
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      id="cart-badge-btn"
      className="cart-badge-button"
      onClick={onClick}
      aria-label="View Cart"
    >
      <span className="cart-icon">🛒</span>
      <span className="cart-label">Cart</span>
      <span className="badge-count" data-testid="cart-badge-count">
        {totalCount}
      </span>
    </button>
  );
};
