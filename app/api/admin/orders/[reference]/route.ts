import { NextRequest, NextResponse } from 'next/server';
import { getOrderByReference, completeOrder, cancelOrder } from '@/lib/actions/orders';
import { isSimplifiedMode } from '@/lib/config/simplified';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Orders are disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reference } = await params;
    const order = await getOrderByReference(reference);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        referenceCode: order.referenceCode,
        totalPrice: order.totalPrice,
        status: order.status,
        items: order.items,
        createdAt: order.createdAt?.toISOString() ?? null,
        customer: order.customer,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    if (isSimplifiedMode()) {
      return NextResponse.json(
        { success: false, message: 'Orders are disabled in simplified mode.' },
        { status: 403 }
      );
    }

    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reference } = await params;
    const body = await request.json();
    const { status } = body as { status: 'completed' | 'cancelled' };

    if (!status || !['completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await getOrderByReference(reference);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'Order has already been processed' },
        { status: 400 }
      );
    }

    let updatedOrder;
    if (status === 'completed') {
      updatedOrder = await completeOrder(order.id);
    } else {
      updatedOrder = await cancelOrder(order.id);
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        referenceCode: updatedOrder.referenceCode,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
