import { NextRequest, NextResponse } from 'next/server';
import { loadProducts, saveProducts, deleteProduct } from '@/lib/db';

export async function GET() {
  try {
    const products = await loadProducts();
    const allReports = products
      .filter((p) => p.reports && p.reports.length > 0)
      .map((p) => ({
        ...p,
        reports: p.reports || [],
      }));

    return NextResponse.json(allReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { productId, reportId, action } = await request.json();

    if (!productId || !reportId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const products = await loadProducts();
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[productIndex];
    if (!product.reports) {
      return NextResponse.json(
        { error: 'No reports found' },
        { status: 404 }
      );
    }

    const reportIndex = product.reports.findIndex((r) => r.id === reportId);
    if (reportIndex === -1) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Delete the product if report is approved
      await deleteProduct(productId);
      return NextResponse.json({
        success: true,
        message: 'Report approved. Product has been deleted.',
      });
    } else if (action === 'reject') {
      // Mark report as rejected
      product.reports[reportIndex].status = 'rejected';
      products[productIndex] = product;
      await saveProducts(products);
      return NextResponse.json({
        success: true,
        message: 'Report rejected.',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 500 }
    );
  }
}
