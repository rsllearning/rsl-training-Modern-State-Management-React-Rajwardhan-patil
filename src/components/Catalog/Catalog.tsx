import React, { useEffect, useState } from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Failed to load catalog (${res.status})`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="catalog-container">
        <div className="status-box">
          <div className="spinner"></div>
          <p>Loading catalog items...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="catalog-container">
        <div className="status-box error-box">
          <p className="error-title">Failed to load catalog</p>
          <p className="error-desc">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="catalog-container">
      <div className="catalog-header">
        <h2>Available Products</h2>
        <span className="product-count">{products.length} items</span>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};
