import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { sendReceiptEmail } from '@/lib/zeptoMail';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 1. Acknowledge non-payment webhooks immediately so FLW doesn't spam us
    if (payload.event !== 'charge.completed') {
       return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const transactionId = payload.data.id;
    const txRef = payload.data.tx_ref; 

    // 2. Redis Lock to prevent duplicate processing
    const lockKey = `webhook_lock:${txRef}`;
    const isLocked = await redis.set(lockKey, 'locked', 'EX', 300, 'NX');
    if (!isLocked) return NextResponse.json({ status: 'success' }, { status: 200 });

    // 3. SECURE VERIFICATION: Ping Flutterwave Directly to ensure it's not a hacker
    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const verifyData = await verifyRes.json();

    // 4. Process only if Flutterwave servers confirm it's real
    if (verifyData.status === 'success' && verifyData.data.status === 'successful') {
      
      let order = await prisma.order.findFirst({ where: { orderNumber: txRef } });
      let mode: 'preorder' | 'sponsor' = 'preorder';
      let customerName = '';
      let customerEmail = '';

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'SUCCESS' }
        });
        customerName = order.name || 'Guest';
        customerEmail = order.email || '';
      } else {
        const sponsor = await prisma.sponsor.findFirst({ where: { orderNumber: txRef } }); 
        if (sponsor) {
          mode = 'sponsor';
          await prisma.sponsor.update({
            where: { id: sponsor.id },
            data: { paymentStatus: 'SUCCESS' }
          });
          customerName = sponsor.name || 'Anonymous';
          customerEmail = sponsor.email || '';
        } else {
          return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
      }

      // 5. Dispatch ZeptoMail Receipt
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
