import { NextRequest, NextResponse } from 'next/server';
import { loadProducts, saveProducts } from '@/lib/db';
import type { ProductReport } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { reason, reportedBy } = await request.json();

    if (!reason || !reportedBy) {
      return NextResponse.json(
        { error: 'Missing reason or reportedBy' },
        { status: 400 }
      );
    }

    const products = await loadProducts();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[productIndex];
    const report: ProductReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reason,
      reportedBy,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };

    if (!product.reports) {
      product.reports = [];
    }

    product.reports.push(report);
    products[productIndex] = product;
    await saveProducts(products);

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error reporting product:', error);
    return NextResponse.json(
      { error: 'Failed to report product' },
      { status: 500 }
    );
  }
}
