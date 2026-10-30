import { atom } from 'jotai';
import type { CartItem, CheckoutResult, Product } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

// base primitive atoms
export const cartItemsAtom = atom<CartItem[]>([]);
export const checkoutStatusAtom = atom<CheckoutStatus>('idle');
export const orderResultAtom = atom<CheckoutResult | null>(null);
export const checkoutErrorAtom = atom<string | null>(null);

// derived read-only atoms - recompute automatically without duplicating in memory
export const totalCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.quantity, 0);
});

export const totalPriceAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// write-only action atoms - callers don't subscribe to state updates
export const addItemAtom = atom(null, (get, set, product: Product) => {
  const items = get(cartItemsAtom);
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    set(
      cartItemsAtom,
      items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  } else {
    set(cartItemsAtom, [...items, { ...product, quantity: 1 }]);
  }
});

export const removeItemAtom = atom(null, (get, set, id: string) => {
  const items = get(cartItemsAtom);
  const existing = items.find((item) => item.id === id);
  if (!existing) return;

  if (existing.quantity > 1) {
    set(
      cartItemsAtom,
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  } else {
    set(
      cartItemsAtom,
      items.filter((item) => item.id !== id)
    );
  }
});

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartItemsAtom, []);
});

export const resetCheckoutAtom = atom(null, (_get, set) => {
  set(checkoutStatusAtom, 'idle');
  set(orderResultAtom, null);
  set(checkoutErrorAtom, null);
});

// async checkout action atom
export const checkoutAtom = atom(null, async (get, set) => {
  const items = get(cartItemsAtom);
  if (items.length === 0) return;

  set(checkoutStatusAtom, 'submitting');
  set(checkoutErrorAtom, null);

  try {
    const total = get(totalPriceAtom);
    const orderPayload = {
      items,
      total,
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
    set(orderResultAtom, result);
    set(cartItemsAtom, []);
    set(checkoutStatusAtom, 'success');
  } catch (err: any) {
    set(checkoutErrorAtom, err.message || 'Failed to complete checkout');
    set(checkoutStatusAtom, 'error');
  }
});
