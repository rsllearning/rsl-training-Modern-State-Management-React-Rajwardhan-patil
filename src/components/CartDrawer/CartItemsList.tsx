import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  addItemAtom,
  cartItemsAtom,
  checkoutAtom,
  checkoutErrorAtom,
  checkoutStatusAtom,
  orderResultAtom,
  removeItemAtom,
  resetCheckoutAtom,
  totalPriceAtom,
} from '../../atoms/cartAtoms';

export const CartItemsList: React.FC = () => {
  // read-only subscriptions tailored strictly to needed values
  const items = useAtomValue(cartItemsAtom);
  const totalPrice = useAtomValue(totalPriceAtom);
  const checkoutStatus = useAtomValue(checkoutStatusAtom);
  const orderResult = useAtomValue(orderResultAtom);
  const checkoutError = useAtomValue(checkoutErrorAtom);

  // action-only setters
  const addItem = useSetAtom(addItemAtom);
  const removeItem = useSetAtom(removeItemAtom);
  const checkout = useSetAtom(checkoutAtom);
  const resetCheckout = useSetAtom(resetCheckoutAtom);

  const isSubmitting = checkoutStatus === 'submitting';

  return (
    <div className="cart-items-container">
      {orderResult && (
        <div className="order-success-banner">
          <p className="success-title">🎉 Order Placed Successfully!</p>
          <p className="order-id">Order ID: #{orderResult.id}</p>
          <p className="order-total">Total Paid: ₹{orderResult.total.toLocaleString('en-IN')}</p>
          <button className="secondary-btn" onClick={() => resetCheckout()}>
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

          <div className="cart-summary-footer">
            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              id="checkout-trigger-btn"
              className="checkout-btn"
              disabled={isSubmitting || items.length === 0}
              onClick={() => checkout()}
            >
              {isSubmitting ? 'Processing Order (1.5s delay)...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
