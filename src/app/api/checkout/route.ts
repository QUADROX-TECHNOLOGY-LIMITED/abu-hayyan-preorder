import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Flutterwave local NGN fee: 2% (capped at ₦2,000)
function calculateGrossAmount(netAmount: number): number {
  const feePercentage = 0.02; // 2%
  let gross = netAmount / (1 - feePercentage);
  let fee = gross - netAmount;
  
  if (fee > 2000) {
    gross = netAmount + 2000;
  }
  
  // We use Math.ceil to round up to the nearest whole Naira 
  // so you don't lose a single kobo to fractional differences.
  return Math.ceil(gross); 
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, name, email, whatsapp, quantity, deliveryMode, state, city, address, nearestPark } = body;

    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateLimitKey = `rate_limit:checkout:${ip}`;
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, 60); 
    if (requests > 5) {
      return NextResponse.json({ status: 'error', message: 'Too many requests. Slow down.' }, { status: 429 });
    }

    const basePrice = 2500;
    const safeQuantity = Number(quantity) || 1;
    const netAmount = safeQuantity * basePrice;
    
    // 1. Calculate the total amount with Flutterwave's 2% fee seamlessly included
    const totalAmount = calculateGrossAmount(netAmount); 
    const orderId = String(Math.floor(100000 + Math.random() * 900000));

    // 2. Force Wema Bank via bank_code: "035" and pass the marked-up total
    const flwResponse = await fetch('https://api.flutterwave.com/v3/virtual-account-numbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email || 'anonymous@abu-hayyan.com',
        is_permanent: false,
        tx_ref: orderId, 
        amount: totalAmount, // E.g., tells the customer to transfer ₦2,552
        bank_code: "035"
      })
    });

    const flwData = await flwResponse.json();

    if (flwData.status !== 'success') {
      console.error('Flutterwave Error:', flwData);
      return NextResponse.json({ status: 'error', message: 'Payment gateway unavailable. Try again.' }, { status: 500 });
    }

    if (mode === 'preorder') {
      await prisma.order.create({
        data: {
          orderNumber: orderId,
          name: name || 'Guest',
          email, whatsapp, quantity: safeQuantity, totalAmount, deliveryMode, state, city, address, nearestPark,
          paymentStatus: 'PENDING',
          dvaReference: flwData.data.order_ref,
          dvaAccountNumber: flwData.data.account_number,
          dvaBankName: flwData.data.bank_name,
        }
      });
    } else if (mode === 'sponsor') {
      await prisma.sponsor.create({
        data: {
          orderNumber: orderId,
          name: name || 'Anonymous',
          email, quantity: safeQuantity, totalAmount,
          paymentStatus: 'PENDING',
          dvaReference: flwData.data.order_ref,
          dvaAccountNumber: flwData.data.account_number,
          dvaBankName: flwData.data.bank_name,
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      accountDetails: {
        account_name: "ABU HAYYAN SCHOOL OF SKILLS",
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
