import React, { useState } from 'react';
import { useCartDispatch, useCartState } from '../../context/CartContext';
import type { CheckoutResult } from '../../types';

export const CartItemsList: React.FC = () => {
  const { items } = useCartState();
  const dispatch = useCartDispatch();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderResult, setOrderResult] = useState<CheckoutResult | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      const orderPayload = {
        items,
        total: totalPrice,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error(`Checkout failed with status: ${res.status}`);
      }

      const result: CheckoutResult = await res.json();
      setOrderResult(result);
      dispatch({ type: 'CLEAR_CART' });
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to complete checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="cart-items-container">
      {orderResult && (
        <div className="order-success-banner">
          <p className="success-title">🎉 Order Placed Successfully!</p>
          <p className="order-id">Order ID: #{orderResult.id}</p>
          <p className="order-total">Total Paid: ₹{orderResult.total.toLocaleString('en-IN')}</p>
          <button
            className="secondary-btn"
            onClick={() => setOrderResult(null)}
          >
            Shop More
          </button>
        </div>
      )}

      {checkoutError && (
        <div className="order-error-banner">
          <p className="error-title">Checkout Failed</p>
          <p>{checkoutError}</p>
        </div>
      )}

      {items.length === 0 && !orderResult ? (
        <div className="empty-cart-view">
          <span className="empty-icon">🛒</span>
          <p className="empty-text">Your cart is empty</p>
          <p className="empty-subtext">Add products from the catalog to see them here.</p>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item-row" id={`cart-item-${item.id}`}>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-unit-price">₹{item.price.toLocaleString('en-IN')} each</span>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                      title="Decrease quantity or remove"
                      id={`remove-qty-${item.id}`}
                    >
                      -
                    </button>
                    <span className="item-qty" data-testid={`qty-${item.id}`}>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
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

          <div className="cart-summary-footer">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              id="checkout-trigger-btn"
              className="checkout-btn"
              disabled={isCheckingOut || items.length === 0}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'Processing Order (1.5s delay)...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
