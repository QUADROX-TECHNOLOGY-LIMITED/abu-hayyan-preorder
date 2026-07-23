import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, name, email, whatsapp, quantity, deliveryMode, state, city, address, nearestPark } = body;

    // 1. Redis Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitKey = `rate_limit:checkout:${ip}`;
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, 60); 
    if (requests > 5) {
      return NextResponse.json({ status: 'error', message: 'Too many requests. Slow down.' }, { status: 429 });
    }

    // 2. Strict Server-Side Price Calculation (Delivery is paid separately by user)
    const basePrice = 2500;
    const totalAmount = quantity * basePrice;

    // 3. Generate 6-Digit Order ID
    const orderId = String(Math.floor(100000 + Math.random() * 900000));

    // 4. Request Dynamic Virtual Account from Flutterwave
    const flwResponse = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'anonymous@abu-hayyan.com',
        is_permanent: false,
        tx_ref: orderId, // 6-digit ID used as the transaction reference
        amount: totalAmount
      })
    });

    const flwData = await flwResponse.json();

    if (flwData.status !== 'success') {
      console.error('Flutterwave Error:', flwData);
      return NextResponse.json({ status: 'error', message: 'Payment gateway unavailable. Try again.' }, { status: 500 });
    }

    // 5. Store Pending Order in PostgreSQL via Prisma
    if (mode === 'preorder') {
      await prisma.order.create({
        data: {
          orderNumber: orderId,
          name: name || 'Guest',
          email,
          whatsapp,
          quantity,
          totalAmount,
          deliveryMode,
          state,
          city,
          address,
          nearestPark,
          paymentStatus: 'PENDING',
          dvaReference: flwData.data.order_ref,
          dvaAccountNumber: flwData.data.account_number,
          dvaBankName: flwData.data.bank_name,
        }
      });
    } else if (mode === 'sponsor') {
      await prisma.sponsor.create({
        data: {
          name: name || 'Anonymous',
          email,
          quantity,
          totalAmount,
          paymentStatus: 'PENDING',
          dvaReference: flwData.data.order_ref,
          dvaAccountNumber: flwData.data.account_number,
          dvaBankName: flwData.data.bank_name,
        }
      });
    }

    // 6. Return Account Details to Frontend Modal
    return NextResponse.json({
      status: 'success',
      accountDetails: {
        account_name: "ABU HAYYAN SCHOOL OF SKILLS AND DEEN",
        account_number: flwData.data.account_number,
        bank_name: flwData.data.bank_name,
        amount: totalAmount,
        expiry_date: "1 Hour",
        order_id: orderId
      }
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
