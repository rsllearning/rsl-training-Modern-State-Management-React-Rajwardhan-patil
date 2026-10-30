import React, { useRef } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
}

// React.memo + selecting only action prevents re-renders on cart changes
export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  // strictly subscribe to action only
  const addItem = useCartStore((state) => state.addItem);
  const renders = useRef(0);
  renders.current += 1;

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-image-placeholder">
        <span className="product-icon">📦</span>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
        <span className="render-indicator" title="Number of renders for this card">
          Renders: {renders.current}
        </span>
      </div>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        id={`add-btn-${product.id}`}
      >
        Add to Cart
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
