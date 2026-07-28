import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Authenticate helper for API routes
async function checkAuth() {
  const token = cookies().get('admin_session')?.value;
  if (!token) return false;
  return await verifyJWT(token);
}

// Fetch all successful pre-orders
export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { paymentStatus: 'SUCCESS' },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ status: 'success', data: orders });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Update the delivery status (Mark as Delivered)
export async function PATCH(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, deliveryStatus } = await req.json();
    
    if (!id || !deliveryStatus) {
      return NextResponse.json({ status: 'error', message: 'Missing parameters' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { deliveryStatus }
    });

    return NextResponse.json({ status: 'success', data: updatedOrder });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to update delivery status' }, { status: 500 });
  }
}
