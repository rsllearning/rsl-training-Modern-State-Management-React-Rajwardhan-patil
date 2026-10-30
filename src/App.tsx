import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header/Header';
import { Catalog } from './components/Catalog/Catalog';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import './App.css';

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="app-layout">
        <Header onOpenCart={() => setIsCartOpen(true)} />
        <Catalog />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </CartProvider>
  );
}

export default App;
