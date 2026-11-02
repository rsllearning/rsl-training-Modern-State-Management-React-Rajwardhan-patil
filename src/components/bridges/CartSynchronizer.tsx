import React, { useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { CheckoutContext } from '../../machines/CheckoutContext';

// Headless bridge: synchronizes Zustand store updates to the checkout machine
export const CartSynchronizer: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const checkoutActor = CheckoutContext.useActorRef();

  useEffect(() => {
    checkoutActor.send({ type: 'SYNC_CART', items });
  }, [items, checkoutActor]);

  return null;
};
