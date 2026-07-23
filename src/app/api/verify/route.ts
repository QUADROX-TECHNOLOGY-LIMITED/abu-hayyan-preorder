import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { accountNumber, mode } = await req.json();

    if (!accountNumber || !mode) {
      return NextResponse.json({ status: 'error', message: 'Missing parameters' }, { status: 400 });
    }

    let isPaid = false;

    // Check the database using the unique virtual account number
    if (mode === 'preorder') {
      const order = await prisma.order.findFirst({ 
        where: { dvaAccountNumber: accountNumber } 
      });
      if (order?.paymentStatus === 'SUCCESS') isPaid = true;
    } else {
      const sponsor = await prisma.sponsor.findFirst({ 
        where: { dvaAccountNumber: accountNumber } 
      });
      if (sponsor?.paymentStatus === 'SUCCESS') isPaid = true;
    }

    return NextResponse.json({ status: 'success', isPaid });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
