import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Catalog } from './components/Catalog/Catalog';
import { CartDrawer } from './components/CartDrawer/CartDrawer';
import './App.css';

export function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="app-layout">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <Catalog />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}

export default App;
