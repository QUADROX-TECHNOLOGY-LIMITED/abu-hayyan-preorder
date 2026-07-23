import { NextResponse } from 'next/server';
import { sendReceiptEmail } from '@/lib/zeptoMail';

export async function GET(req: Request) {
  // Grab the email from the URL, or default to your Quadrox email
  const { searchParams } = new URL(req.url);
  const targetEmail = searchParams.get('email') || 'dev@quadroxtech.cloud';

  try {
    // 1. Fire the Pre-order Template
    const preOrderSent = await sendReceiptEmail(
      targetEmail,
      'Mukhtar (Pre-Order Test)',
      '654321', // Dummy 6-digit Order ID
      'preorder'
    );

    // 2. Fire the Sponsor Template
    const sponsorSent = await sendReceiptEmail(
      targetEmail,
      'Mukhtar (Sponsor Test)',
      '123456', 
      'sponsor'
    );

    if (preOrderSent && sponsorSent) {
      return NextResponse.json({ 
        status: 'success', 
        message: `Both test emails successfully fired to ${targetEmail}!` 
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        message: 'One or both emails failed to send. Check Railway logs.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
  }
}
