import React, { useRef } from 'react';
import { useSetAtom } from 'jotai';
import type { Product } from '../../types';
import { addItemAtom } from '../../atoms/cartAtoms';

interface ProductCardProps {
  product: Product;
}

// React.memo + useSetAtom ensures 0 re-renders when cart state updates
export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  // write-only atom setter - no subscription to cart state
  const addItem = useSetAtom(addItemAtom);
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
