'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import type { Product } from '@/lib/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    price: 500,
    conditions: [] as string[],
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Refetch products when window comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleFilterChange = (
    newFilters: Partial<typeof filters>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  
  const filteredProducts = products.filter((product: Product) => {
    // Don't show sold products
    if (product.sold) return false;
    
    const categoryMatch =
      filters.category === 'all' || product.category.toLowerCase() === filters.category;
    const priceMatch = product.price <= filters.price;
    const conditionMatch =
      filters.conditions.length === 0 ||
      filters.conditions.includes(product.condition.toLowerCase().replace(' ', ''));

    return categoryMatch && priceMatch && conditionMatch;
  });


  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Find Your Next Campus Treasure
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Buy and sell pre-loved items within your college community.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </aside>
        <main className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">No Products Found</h3>
                  <p className="mt-2 text-muted-foreground">
                    Try adjusting your filters to find what you&apos;re looking for.
                  </p>
                </div>
              </div>
          )}
        </main>
      </div>
    </div>
  );
}
