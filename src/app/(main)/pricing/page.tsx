

'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { useProStatus } from '@/context/pro-status-context';
import { useRouter } from 'next/navigation';

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
      'AI Content Generation',
      'AI Caption Rewriter',
      'AI Hashtag Suggestions',
      'AI Trend Analysis',
      'YouTube Studio Access',
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
    cta: 'Upgrade to Agency',
    ctaLink: '#',
  },
];

export default function PricingPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { isProPlan, setIsProPlan, isAgencyPlan, setIsAgencyPlan, setCredits } = useProStatus();
  const router = useRouter();

  const handleUpgrade = (plan: 'Pro' | 'Agency') => {
    showLoading();
    setTimeout(() => {
        if (plan === 'Pro') {
            setIsProPlan(true);
            setCredits(prev => Math.max(prev, 50)); // Set credits to 50 if they are lower
        }
        if (plan === 'Agency') {
            setIsProPlan(true); // Agency includes Pro features
            setIsAgencyPlan(true);
            setCredits(prev => Math.max(prev, 200)); // Set credits to 200 if they are lower
        }
        hideLoading();
        toast({
            title: "Plan Activated!",
            description: `You've successfully upgraded to the ${plan} Plan. All features are now unlocked.`
        });
        router.push('/dashboard');
    }, 1500)
  }

  const getButtonState = (planName: string) => {
    if (planName === 'Agency') {
      return {
        disabled: isAgencyPlan,
        text: isAgencyPlan ? 'Current Plan' : 'Upgrade to Agency'
      }
    }
    if (planName === 'Pro') {
      return {
        disabled: isProPlan && !isAgencyPlan,
        text: isProPlan && !isAgencyPlan ? 'Current Plan' : 'Upgrade to Pro'
      }
    }
    return {
      disabled: false,
      text: 'Start Trial'
    }
  }


  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Find a Plan That's Right for You</h1>
        <p className="text-muted-foreground mt-2">
          Start for free and scale up as you grow. All plans are flexible and can be cancelled anytime.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const { disabled, text } = getButtonState(plan.name);
          return (
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
                {plan.name === 'Free Trial' ? (
                  <Button asChild className="w-full" variant={'outline'}>
                      <Link href={plan.ctaLink}>{text}</Link>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleUpgrade(plan.name as 'Pro' | 'Agency')} disabled={disabled}>
                    {text}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
