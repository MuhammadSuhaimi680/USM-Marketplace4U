import fs from 'fs/promises';
import path from 'path';
import type { Product } from './types';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

export async function loadProducts(): Promise<Product[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await loadProducts();
  const newProduct: Product = {
    ...product,
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find((p) => p.id === id) || null;
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter((p) => p.sellerId === sellerId);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await loadProducts();
  const filtered = products.filter((p) => p.id !== id);
  await saveProducts(filtered);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await loadProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  await saveProducts(products);
  return products[index];
}
