import React from 'react';

interface CartBadgeProps {
  onClick: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  const totalCount = 0;

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
