import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Double-verify the session on the backend
    const token = cookies().get('admin_session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Fetch Aggregated Metrics
    // We only count SUCCESSFUL payments.
    const [successfulOrders, successfulSponsors] = await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: 'SUCCESS' },
        _sum: { quantity: true }
      }),
      prisma.sponsor.aggregate({
        where: { paymentStatus: 'SUCCESS' },
        _sum: { quantity: true }
      })
    ]);

    const booksSold = successfulOrders._sum.quantity || 0;
    const sponsoredCopies = successfulSponsors._sum.quantity || 0;
    
    // Calculate total net revenue based strictly on your ₦2,500 base price
    // ignoring the 2% markup that Flutterwave eats.
    const totalRevenue = (booksSold + sponsoredCopies) * 2500;

    return NextResponse.json({
      status: 'success',
      data: {
        booksSold,
        sponsoredCopies,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Admin Data API Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
