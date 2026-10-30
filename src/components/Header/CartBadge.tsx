import React from 'react';
import { useAtomValue } from 'jotai';
import { totalCountAtom } from '../../atoms/cartAtoms';

interface CartBadgeProps {
  onClick: () => void;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ onClick }) => {
  // strictly subscribe to derived total count atom only
  const totalCount = useAtomValue(totalCountAtom);

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
