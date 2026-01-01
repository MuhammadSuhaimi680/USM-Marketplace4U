import { NextRequest, NextResponse } from 'next/server';
import { addProduct, loadProducts } from '@/lib/db';
import type { Product } from '@/lib/types';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);

    const body = await request.json();

    // If User Isn't Logged In
    if (!session){
       return NextResponse.json(
        {error: 'Unauthorised'},
        {status: 401}
       );
    }

    // If user isn't a seller
     if (session.user.role !== 'seller' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only sellers can create products' },
        { status: 403 }
      );
    }

     // Verify user can only create products for themselves (unless admin)
     if (session.user.role !== 'seller' && session.user.role !== body.sellerId) {
      return NextResponse.json(
        { error: 'Only sellers can create products' },
        { status: 403 }
      );
    }

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
