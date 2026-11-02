import { createActorContext } from '@xstate/react';
import { checkoutMachine } from './checkoutMachine';

// Single shared actor context for all sibling checkout components
export const CheckoutContext = createActorContext(checkoutMachine);
