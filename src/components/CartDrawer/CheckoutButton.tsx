import React from 'react';
import { CheckoutContext } from '../../machines/CheckoutContext';

interface CheckoutButtonProps {
  onTrigger?: () => void;
}

// Declaratively queries machine's ability to transition without hardcoding business rules in JSX
export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ onTrigger }) => {
  const checkoutActor = CheckoutContext.useActorRef();
  const canSubmit = CheckoutContext.useSelector((state) => state.can({ type: 'SUBMIT' }));
  const isPaying = CheckoutContext.useSelector((state) => state.matches('payment'));

  const handleClick = () => {
    checkoutActor.send({ type: 'SUBMIT' });
    onTrigger?.();
  };

  return (
    <button
      id="checkout-trigger-btn"
      className="checkout-btn"
      disabled={!canSubmit || isPaying}
      onClick={handleClick}
    >
      {isPaying ? 'Processing Order (1.5s delay)...' : 'Proceed to Checkout'}
    </button>
  );
};
