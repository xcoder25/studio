
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { customer, plan } = await request.json();

  if (!customer || !plan) {
    return NextResponse.json({ error: 'Customer and Plan are required' }, { status: 400 });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'YOUR_PAYSTACK_SECRET_KEY') {
    console.error('Paystack secret key is not configured.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
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
      return NextResponse.json({ error: data.message || 'Failed to create subscription.' }, { status: paystackResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
