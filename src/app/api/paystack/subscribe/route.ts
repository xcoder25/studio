
import { NextResponse } from 'next/server';

async function findCustomerByEmail(email: string, apiKey: string) {
  const url = new URL('https://api.paystack.co/customer');
  url.searchParams.append('email', email);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const data = await response.json();

  if (response.ok && data.status && data.data.length > 0) {
    return data.data[0]; // Return the first customer found
  }
  
  return null;
}

async function createCustomer(email: string, apiKey: string) {
    const response = await fetch('https://api.paystack.co/customer', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok || !data.status) {
        throw new Error(data.message || "Failed to create Paystack customer.");
    }
    return data.data;
}


export async function POST(request: Request) {
  const { customer, plan } = await request.json();

  if (!customer || !plan) {
    return NextResponse.json({ message: 'Customer and Plan are required' }, { status: 400 });
  }

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    console.error('Paystack secret key is not configured.');
    return NextResponse.json({ message: 'Server configuration error. Paystack secret key is missing.' }, { status: 500 });
  }

  try {
    let paystackCustomer = await findCustomerByEmail(customer, PAYSTACK_SECRET_KEY);

    if (!paystackCustomer) {
        paystackCustomer = await createCustomer(customer, PAYSTACK_SECRET_KEY);
    }
      
    const paystackResponse = await fetch('https://api.paystack.co/subscription', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: paystackCustomer.customer_code,
        plan,
      }),
    });

    const data = await paystackResponse.json();

    if (!paystackResponse.ok) {
      console.error('Paystack API Error:', data);
      return NextResponse.json({ message: data.message || 'Failed to create subscription.' }, { status: paystackResponse.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
