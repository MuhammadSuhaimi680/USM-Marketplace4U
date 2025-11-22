'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const allProducts: Product[] = await response.json();
        const sellerProducts = allProducts
          .filter((p) => p.sellerId === user.id)
          .filter((p) => !p.sold); // Filter out sold items
        setMyProducts(sellerProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchMyProducts();
    }
  }, [user, authLoading]);

  const handleMarkAsSold = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sold: true }),
      });

      if (response.ok) {
        // Remove the product from the list
        setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error('Error marking product as sold:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">
          <p>Please log in to view your products.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Redirect admin users away from this page
  if (user.role === "admin") {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="text-center">
          <p className="text-lg font-semibold">This page is for sellers only.</p>
          <p className="mt-2 text-muted-foreground">Please visit the <Link href="/admin" className="text-primary hover:underline">Admin Dashboard</Link> instead.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Products</CardTitle>
            <CardDescription>Manage your product listings.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/products/new">Add New Product</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myProducts.length > 0 ? (
                myProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrl}
                        width="64"
                        data-ai-hint={product.imageHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell>RM{product.price.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleMarkAsSold(product.id)}
                            className="text-green-600"
                          >
                            Mark as Sold
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    You haven&apos;t listed any products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

