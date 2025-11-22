export type User = {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  phone: string;
  avatarUrl: string;
  listingsCount: number;
  createdAt: string;
};

export type ProductReport = {
  id: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Clothes' | 'Gadgets' | 'Books' | 'Furniture' | 'Other';
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  imageUrl: string;
  imageHint: string;
  sellerId: string;
  createdAt: string;
  sold?: boolean;
  reports?: ProductReport[];
};
