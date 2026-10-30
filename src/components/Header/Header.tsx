import React from 'react';
import { Toolbar } from './Toolbar';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <span className="brand-icon">⚡</span>
          <div className="brand-text">
            <span className="brand-title">ShopCart</span>
            <span className="brand-subtitle">E-Commerce Store</span>
          </div>
        </div>
        <Toolbar onOpenCart={onOpenCart} />
      </div>
    </header>
  );
};
