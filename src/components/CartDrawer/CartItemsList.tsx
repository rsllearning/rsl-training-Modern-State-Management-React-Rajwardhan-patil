import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../store/cartStore';

// Leaf component: granularly subscribes to cart items and mutation actions
export const CartItemsList: React.FC = () => {
  const { items, addItem, removeItem } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      addItem: state.addItem,
      removeItem: state.removeItem,
    }))
  );

  if (items.length === 0) {
    return (
      <div className="empty-cart-view">
        <span className="empty-icon">🛒</span>
        <p className="empty-text">Your cart is empty</p>
        <p className="empty-subtext">Add products from the catalog to see them here.</p>
      </div>
    );
  }

  return (
    <div className="cart-items-list">
      {items.map((item) => (
        <div key={item.id} className="cart-item-row" id={`cart-item-${item.id}`}>
          <div className="cart-item-info">
            <span className="cart-item-name">{item.name}</span>
            <span className="cart-item-unit-price">
              ₹{item.price.toLocaleString('en-IN')} each
            </span>
          </div>

          <div className="cart-item-controls">
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => removeItem(item.id)}
                title="Decrease quantity or remove"
                id={`remove-qty-${item.id}`}
              >
                -
              </button>
              <span className="item-qty" data-testid={`qty-${item.id}`}>
                {item.quantity}
              </span>
              <button
                className="qty-btn"
                onClick={() => addItem(item)}
                title="Increase quantity"
                id={`add-qty-${item.id}`}
              >
                +
              </button>
            </div>
            <span className="item-subtotal">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
