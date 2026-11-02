import React, { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { CheckoutContext } from '../../machines/CheckoutContext';

// Headless bridge: listens to the machine's success notification to clear Zustand store
export const OrderCompletionBridge: React.FC = () => {
  const checkoutActor = CheckoutContext.useActorRef();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Subscribe to emitted events from the machine without coupling store inside machine
    const subscription = checkoutActor.on('orderSuccess', () => {
      clearCart();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkoutActor, clearCart]);

  return null;
};
