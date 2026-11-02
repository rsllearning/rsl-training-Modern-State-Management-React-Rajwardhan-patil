import { setup, fromPromise, assign, emit } from 'xstate';
import type { CartItem, CheckoutResult } from '../types';

export interface CheckoutContext {
  items: CartItem[];
  orderResult: CheckoutResult | null;
  errorMessage: string | null;
}

export type CheckoutEvent =
  | { type: 'SYNC_CART'; items: CartItem[] }
  | { type: 'SUBMIT' }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

export type CheckoutEmitted = {
  type: 'orderSuccess';
  result: CheckoutResult;
};

// XState v5 Checkout Machine
export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
    emitted: {} as CheckoutEmitted,
  },
  actors: {
    // Payment actor with native AbortSignal support
    paymentActor: fromPromise(
      async ({ input, signal }: { input: { items: CartItem[]; total: number }; signal: AbortSignal }) => {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: input.items,
            total: input.total,
            createdAt: new Date().toISOString(),
          }),
          signal, // Aborted automatically if CANCEL event stops the actor
        });

        if (!res.ok) {
          throw new Error(`Order failed with server status ${res.status}`);
        }

        return (await res.json()) as CheckoutResult;
      }
    ),
  },
  guards: {
    // Prevent checkout if cart is empty
    hasItems: ({ context }) => context.items.length > 0,
  },
}).createMachine({
  id: 'checkout',
  initial: 'review',
  context: {
    items: [],
    orderResult: null,
    errorMessage: null,
  },
  states: {
    review: {
      on: {
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
          }),
        },
        SUBMIT: {
          guard: 'hasItems',
          target: 'payment',
          actions: assign({
            errorMessage: null,
          }),
        },
      },
    },
    payment: {
      invoke: {
        id: 'paymentActor',
        src: 'paymentActor',
        input: ({ context }) => ({
          items: context.items,
          total: context.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        onDone: {
          target: 'success',
          actions: [
            assign({
              orderResult: ({ event }) => event.output,
              errorMessage: null,
            }),
            // Notify headless bridges without coupling store mutations inside machine
            emit(({ event }) => ({
              type: 'orderSuccess',
              result: event.output,
            })),
          ],
        },
        onError: {
          target: 'review',
          actions: assign({
            errorMessage: ({ event }) =>
              event.error instanceof Error ? event.error.message : 'Payment submission failed',
          }),
        },
      },
      on: {
        // Mid-flight cancellation: stops actor, aborts fetch signal, returns to review
        CANCEL: {
          target: 'review',
          actions: assign({
            errorMessage: null,
          }),
        },
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
          }),
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'review',
          actions: assign({
            orderResult: null,
            errorMessage: null,
          }),
        },
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
          }),
        },
      },
    },
  },
});
