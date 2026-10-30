import React from 'react';
import { CartBadge } from './CartBadge';

interface ToolbarProps {
  onOpenCart: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenCart }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-info">
        <span className="badge-tag">Zustand Store</span>
      </div>
      <CartBadge onClick={onOpenCart} />
    </div>
  );
};
