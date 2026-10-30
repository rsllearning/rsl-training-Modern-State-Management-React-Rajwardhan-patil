import React from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-image-placeholder">
        <span className="product-icon">📦</span>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
      <button
        className="add-to-cart-btn"
        id={`add-btn-${product.id}`}
      >
        Add to Cart
      </button>
    </div>
  );
};
