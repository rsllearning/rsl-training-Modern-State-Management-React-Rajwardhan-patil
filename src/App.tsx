import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Catalog } from './components/Catalog/Catalog';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import { PaymentPanel } from './components/Payment/PaymentPanel';
import { CartSynchronizer } from './components/bridges/CartSynchronizer';
import { OrderCompletionBridge } from './components/bridges/OrderCompletionBridge';
import { CheckoutContext } from './machines/CheckoutContext';
import './App.css';

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CheckoutContext.Provider>
      <div className="app-layout">
        {/* Headless synchronization bridges */}
        <CartSynchronizer />
        <OrderCompletionBridge />

        <Header onOpenCart={() => setIsCartOpen(true)} />
        <Catalog />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Sibling panel sharing the checkout actor */}
        <PaymentPanel />
      </div>
    </CheckoutContext.Provider>
  );
}

export default App;
