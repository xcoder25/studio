
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { customer, plan } = await request.json();

  if (!customer || !plan) {
    return NextResponse.json({ message: 'Customer and Plan are required' }, { status: 400 });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'YOUR_PAYSTACK_SECRET_KEY' || PAYSTACK_SECRET_KEY === 'sk_live_df23d84cc1f7219197eacdb8058ddcc7018cf14a') {
    console.error('Paystack secret key is not configured.');
    return NextResponse.json({ message: 'Server configuration error. Paystack secret key is missing.' }, { status: 500 });
  }

  try {
    const paystackResponse = await fetch('https://api.paystack.co/subscription', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer,
        plan,
      }),
    });

    const data = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack API Error:', data);
      return NextResponse.json({ message: data.message || 'Failed to create subscription.' }, { status: paystackResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
