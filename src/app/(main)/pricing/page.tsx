
'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'for 14 days',
    description: 'Explore the core features of Trendix and see how AI can transform your workflow.',
    features: [
      '1 Facebook Page, 2 pages',
      '1 Instagram Account',
      'AI Content Generation',
      'Video Editor (5 credits)',
      'Basic Analytics',
    ],
    cta: 'Start Your Free Trial',
    ctaLink: '/signup',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/ month',
    description: 'For individual creators and small businesses ready to grow.',
    features: [
      'Up to 5 Social Accounts',
      'Full AI Assistant Suite',
      'Video Editor (50 credits/month)',
      'Advanced Analytics & Reporting',
      'Content Scheduling',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '#',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$129',
    period: '/ month',
    description: 'For agencies and marketing teams managing multiple clients.',
    features: [
      'Unlimited Social Accounts',
      'Team Collaboration Tools (3 seats)',
      'Video Editor (200 credits/month)',
      'White-label Client Reporting',
      'Priority Support',
    ],
    cta: 'Contact Sales',
    ctaLink: '#',
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Find a Plan That's Right for You</h1>
        <p className="text-muted-foreground mt-2">
          Start for free and scale up as you grow. All plans are flexible and can be cancelled anytime.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn("flex flex-col", plan.popular && "border-primary ring-2 ring-primary")}>
            <CardHeader className="flex-grow-0">
              {plan.popular && <div className="text-center"><div className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary-foreground bg-primary rounded-full">Most Popular</div></div>}
              <CardTitle className="text-center text-3xl font-bold pt-4">{plan.name}</CardTitle>
              <CardDescription className="text-center">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </CardDescription>
              <CardDescription className="text-center h-10">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
