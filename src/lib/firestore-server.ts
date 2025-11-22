import { loadProducts, addProduct as dbAddProduct, getProductById as dbGetProductById, getProductsBySeller as dbGetProductsBySeller } from '@/lib/db';
import type { Product } from '@/lib/types';
import { products as sampleProducts } from '@/lib/data';

// Server-side only product functions using local file storage
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    return await dbGetProductById(productId);
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to sample data
    return sampleProducts.find((p) => p.id === productId) || null;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const localProducts = await loadProducts();
    
    // If no products in local storage, return sample data
    if (localProducts.length === 0) {
      return sampleProducts;
    }
    
    return localProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fall back to sample data on error
    return sampleProducts;
  }
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  try {
    return await dbGetProductsBySeller(sellerId);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return await dbAddProduct(product);
}
