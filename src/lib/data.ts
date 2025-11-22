import type { User, Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find((img) => img.id === id);

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@campuscart.com',
    role: 'admin',
    phone: '1234567890',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    listingsCount: 2,
    createdAt: '2023-10-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Seller Sam',
    email: 'sam@campuscart.com',
    role: 'seller',
    phone: '0987654321',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    listingsCount: 3,
    createdAt: '2023-10-02T11:00:00Z',
  },
  {
    id: '3',
    name: 'Buyer Ben',
    email: 'ben@campuscart.com',
    role: 'buyer',
    phone: '1122334455',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    listingsCount: 1,
    createdAt: '2023-10-03T12:00:00Z',
  },
  {
    id: 'avs5INwX7LRZKEzFQ1h2dsEXi923',
    name: 'Mark Goldbridge',
    email: 'mark@campuscart.com',
    role: 'seller',
    phone: '60123456789',
    avatarUrl: 'https://picsum.photos/seed/markgoldbridge/100/100',
    listingsCount: 3,
    createdAt: '2023-10-04T13:00:00Z',
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Vintage University Hoodie',
    description:
      'A slightly used vintage hoodie from the 90s. Great condition, very comfortable.',
    price: 25.0,
    category: 'Clothes',
    condition: 'Good',
    imageUrl: getImage('product1')?.imageUrl || '',
    imageHint: getImage('product1')?.imageHint || '',
    sellerId: '1',
    createdAt: '2023-10-05T14:00:00Z',
  },
  {
    id: 'p2',
    name: 'Bugatti Chiron',
    description:
      'What colour is your bugatti?',
    price: 150.0,
    category: 'Gadgets',
    condition: 'Like New',
    imageUrl: getImage('product2')?.imageUrl || '',
    imageHint: getImage('product2')?.imageHint || '',
    sellerId: '2',
    createdAt: '2023-10-06T15:00:00Z',
  },
  {
    id: 'p3',
    name: 'Introduction to Algorithms Textbook',
    description:
      'Required textbook for CPT113. Minimal highlighting, includes access code.',
    price: 50.0,
    category: 'Books',
    condition: 'Good',
    imageUrl: getImage('product3')?.imageUrl || '',
    imageHint: getImage('product3')?.imageHint || '',
    sellerId: '2',
    createdAt: '2023-10-07T16:00:00Z',
  },
  {
    id: 'p4',
    name: 'Mini Fridge for Dorm Room',
    description:
      'Compact and efficient mini fridge. Perfect for keeping snacks and drinks cool.',
    price: 355.0,
    category: 'Gadgets',
    condition: 'Fair',
    imageUrl: getImage('product4')?.imageUrl || '',
    imageHint: getImage('product4')?.imageHint || '',
    sellerId: '1',
    createdAt: '2023-10-08T17:00:00Z',
  },
  {
    id: 'p5',
    name: 'Bluetooth Earbuds',
    description:
      'Brand new in box, never opened. Great sound quality and long battery life.',
    price: 40.0,
    category: 'Gadgets',
    condition: 'New',
    imageUrl: getImage('product5')?.imageUrl || '',
    imageHint: getImage('product5')?.imageHint || '',
    sellerId: '2',
    createdAt: '2023-10-09T18:00:00Z',
  },
  {
    id: 'p6',
    name: 'Ergonomic Desk Chair',
    description:
      'Ergonomic chair with lumbar support. A must-have for long study sessions.',
    price: 90.0,
    category: 'Furniture',
    condition: 'Like New',
    imageUrl: getImage('product6')?.imageUrl || '',
    imageHint: getImage('product6')?.imageHint || '',
    sellerId: '3',
    createdAt: '2023-10-10T19:00:00Z',
  },
];
