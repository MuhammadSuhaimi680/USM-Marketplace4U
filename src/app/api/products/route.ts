import { NextRequest, NextResponse } from 'next/server';
import { addProduct, loadProducts } from '@/lib/db';
import type { Product } from '@/lib/types';
import { getServerSession } from ""
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const products = await loadProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category || !body.sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const productData: Omit<Product, 'id'> = {
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      category: body.category,
      condition: body.condition || 'Good',
      imageUrl: body.imageUrl || '',
      imageHint: body.imageHint || '',
      sellerId: body.sellerId,
      createdAt: new Date().toISOString(),
    };

    const newProduct = await addProduct(productData);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
