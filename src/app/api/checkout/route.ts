import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, name, email, whatsapp, quantity, deliveryMode, state, city, address, nearestPark } = body;

    // 1. Redis Rate Limiting Check (Prevent API Abuse)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitKey = `rate_limit:checkout:${ip}`;
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, 60); // Max requests per minute
    if (requests > 5) {
      return NextResponse.json({ status: 'error', message: 'Too many requests. Slow down.' }, { status: 429 });
    }

    // 2. Strict Server-Side Price Calculation
    const basePrice = 2500;
    const deliveryFee = deliveryMode === 'home_delivery' ? 3000 : 0;
    const totalAmount = (quantity * basePrice) + deliveryFee;

    // 3. Generate Unique Transaction Reference
    const tx_ref = `AH-PRE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
        bvn: "", // Omit if not strictly required by your compliance tier
        tx_ref: tx_ref,
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
          orderNumber: tx_ref,
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
        account_number: flwData.data.account_number,
        bank_name: flwData.data.bank_name,
        amount: flwData.data.amount,
        expiry: flwData.data.expiry_date
      }
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
