'use client';

import { collection, query, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Product } from '@/lib/types';

// Users
export async function getUsers(): Promise<User[]> {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
}

export async function getUserById(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { ...userDoc.data(), id: userDoc.id } as User : null;
}

// Products
export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  return productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

export async function getProductById(productId: string): Promise<Product | null> {
  const productDoc = await getDoc(doc(db, 'products', productId));
  return productDoc.exists() ? { ...productDoc.data(), id: productDoc.id } as Product : null;
}

export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const q = query(productsCol, where('sellerId', '==', sellerId));
  const productSnapshot = await getDocs(q);
  return productSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), product);
  return docRef.id;
}

export async function updateProduct(productId: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', productId), data);
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', userId), data);
}

export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}
