import React from 'react';
import { selectTotalCount, useCartStore } from '../../store/cartStore';

interface CartBadgeProps {
  onClick: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  // subscribe only to total items count derived via selector
  const totalCount = useCartStore(selectTotalCount);

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
