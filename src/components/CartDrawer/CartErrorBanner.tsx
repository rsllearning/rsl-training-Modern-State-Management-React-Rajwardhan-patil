import React from 'react';
import { CheckoutContext } from '../../machines/CheckoutContext';

// Subscribes strictly to machine error slice to prevent unnecessary container re-renders
export const CartErrorBanner: React.FC = () => {
  const errorMessage = CheckoutContext.useSelector((state) => state.context.errorMessage);

  if (!errorMessage) return null;

  return (
    <div className="order-error-banner" role="alert" id="cart-error-banner">
      <p className="error-title">Checkout Failed</p>
      <p>{errorMessage}</p>
    </div>
  );
};
