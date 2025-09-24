
'use client';

import { Check, Zap, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { runEngagementBooster } from '@/ai/flows/run-engagement-booster';

const boosterPlans = [
  {
    name: 'Starter Growth',
    price: '$29',
    period: '/ month',
    description: 'Steady, organic growth for getting started.',
    features: [
      'Up to 100 daily interactions (likes/follows)',
      'Basic keyword and hashtag targeting',
      'Standard AI safety filters',
      'Weekly performance summary',
    ],
    cta: 'Choose Starter',
  },
  {
    name: 'Rapid Growth',
    price: '$79',
    period: '/ month',
    description: 'Accelerated growth for serious creators and brands.',
    features: [
      'Up to 500 daily interactions (likes/follows)',
      'Advanced targeting (competitors, lookalikes)',
      'Enhanced AI safety & spam avoidance filters',
      'Real-time engagement tracking',
      'Priority support',
    ],
    cta: 'Choose Rapid',
    popular: true,
  },
  {
    name: 'Hyper Growth',
    price: '$199',
    period: '/ month',
    description: 'Maximum velocity for accounts aiming for viral growth.',
    features: [
      'Up to 1500+ daily interactions (likes/follows)',
      'Aggressive targeting & multi-platform strategy',
      'Premium AI safety & anti-shadowban shield',
      'Dedicated account manager',
      'In-depth weekly strategy calls',
    ],
    cta: 'Choose Hyper',
  },
];

export default function EngagementBoosterPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const handleChoosePlan = async (planName: string) => {
    showLoading();
    try {
        const result = await runEngagementBooster({
            planName: planName,
            brandName: 'Trendix',
            targetAudience: 'Social media managers and digital creators interested in AI tools.'
        });

        toast({
            title: "Booster Agent Activated!",
            description: result.engagementSummary.summary,
        });

    } catch (error) {
        console.error("Engagement booster failed:", error);
        toast({
            variant: 'destructive',
            title: 'Activation Failed',
            description: 'The AI agent could not be started.'
        });
    } finally {
        hideLoading();
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center items-center gap-4">
            <Zap className="size-10 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold">Engagement Booster Pack</h1>
        </div>
        <p className="text-muted-foreground mt-4 text-lg">
          Supercharge your growth with AI-powered automation. Select a plan to put your audience building on autopilot and achieve results faster than ever before.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
        {boosterPlans.map((plan) => (
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
                    <Check className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => handleChoosePlan(plan.name)}>
                    {plan.cta}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card className="bg-card/50">
            <CardHeader className="text-center">
                <Shield className="mx-auto size-8 text-primary"/>
                <CardTitle>Safety & Trust</CardTitle>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto text-center text-muted-foreground">
                <p>
                Our Engagement Booster uses advanced AI to mimic human behavior, keeping your account safe from platform flags. We prioritize the health of your account by using smart rate-limiting and avoiding spammy tactics, ensuring sustainable, long-term growth.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
