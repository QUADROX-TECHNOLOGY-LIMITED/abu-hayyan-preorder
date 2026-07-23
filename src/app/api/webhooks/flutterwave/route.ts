import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { sendReceiptEmail } from '@/lib/zeptoMail';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function POST(req: Request) {
  try {
    // 1. Verify Webhook Signature
    const signature = req.headers.get('verif-hash');
    if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // We only care about successful transfers
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const txRef = payload.data.tx_ref; // This is our 6-digit Order ID

      // 2. Redis Lock (Idempotency) to prevent duplicate processing
      const lockKey = `webhook_lock:${txRef}`;
      const isLocked = await redis.set(lockKey, 'locked', 'EX', 300, 'NX');
      
      if (!isLocked) {
        // Webhook is already being processed, return 200 to acknowledge receipt
        return NextResponse.json({ status: 'success' }, { status: 200 });
      }

      // 3. Find the Order or Sponsor record
      let order = await prisma.order.findFirst({ where: { orderNumber: txRef } });
      let mode: 'preorder' | 'sponsor' = 'preorder';
      let customerName = '';
      let customerEmail = '';

      if (order) {
        // Update Preorder
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'SUCCESS' }
        });
        customerName = order.name;
        customerEmail = order.email;
      } else {
        // Check Sponsors if not found in Orders
        const sponsor = await prisma.sponsor.findFirst({ where: { orderNumber: txRef } }); // Ensure schema maps orderNumber to Sponsor
        if (sponsor) {
          mode = 'sponsor';
          await prisma.sponsor.update({
            where: { id: sponsor.id },
            data: { paymentStatus: 'SUCCESS' }
          });
          customerName = sponsor.name;
          customerEmail = sponsor.email;
        } else {
          return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
      }

      // 4. Dispatch ZeptoMail Receipt
      if (customerEmail) {
        await sendReceiptEmail(customerEmail, customerName, txRef, mode);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
