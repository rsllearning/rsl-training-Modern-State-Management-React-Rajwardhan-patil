import { create } from 'zustand';
import type { CartItem, CheckoutResult, Product } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

interface CartState {
  items: CartItem[];
  checkoutStatus: CheckoutStatus;
  orderResult: CheckoutResult | null;
  checkoutError: string | null;

  // actions
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  resetCheckout: () => void;
  checkout: () => Promise<void>;
}

// zustand cart store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  checkoutStatus: 'idle',
  orderResult: null,
  checkoutError: null,

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    });
  },

  removeItem: (id: string) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === id);
      if (!existing) return state;

      if (existing.quantity > 1) {
        return {
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ),
        };
      }
      return {
        items: state.items.filter((item) => item.id !== id),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  resetCheckout: () => set({ checkoutStatus: 'idle', orderResult: null, checkoutError: null }),

  // async checkout action reading state directly with get()
  checkout: async () => {
    const { items } = get();
    if (items.length === 0) return;

    set({ checkoutStatus: 'submitting', checkoutError: null });

    try {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
      set({
        items: [],
        checkoutStatus: 'success',
        orderResult: result,
      });
    } catch (err: any) {
      set({
        checkoutStatus: 'error',
        checkoutError: err.message || 'Failed to complete checkout',
      });
    }
  },
}));

// derived selectors - never duplicate in stored state
export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectTotalCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
