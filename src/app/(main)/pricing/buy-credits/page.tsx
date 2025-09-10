
'use client';

import { Check, Zap, Star, Shield, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLoading } from '@/context/loading-context';
import { useProStatus } from '@/context/pro-status-context';

const creditPacks = [
  {
    name: 'Starter Pack',
    credits: 100,
    price: '$10',
    description: 'Perfect for topping up your account for a few extra generations.',
    cta: 'Buy Now',
  },
  {
    name: 'Creator Pack',
    credits: 550,
    price: '$50',
    description: 'Best value for regular content creators and small projects.',
    features: ['Includes 50 bonus credits'],
    cta: 'Buy Now',
    popular: true,
  },
  {
    name: 'Agency Pack',
    credits: 1200,
    price: '$100',
    description: 'For power users and agencies managing multiple clients.',
    features: ['Includes 200 bonus credits', 'Priority access to new models'],
    cta: 'Buy Now',
  },
];

export default function BuyCreditsPage() {
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { setCredits } = useProStatus();

  const handlePurchase = (packName: string, amount: number) => {
    showLoading();
    setTimeout(() => {
        setCredits(prev => prev + amount);
        hideLoading();
        toast({
            title: "Purchase Successful!",
            description: `You've added ${amount} credits to your account.`
        })
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Buy More Credits</h1>
        <p className="text-muted-foreground mt-2">
          Need more power? Top up your account with additional credits. Credits are used for AI generation tasks like video creation and content writing.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {creditPacks.map((pack) => (
          <Card key={pack.name} className={cn("flex flex-col", pack.popular && "border-primary ring-2 ring-primary")}>
            <CardHeader className="flex-grow-0">
              {pack.popular && <div className="text-center"><div className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary-foreground bg-primary rounded-full">Most Popular</div></div>}
              <CardTitle className="text-center text-3xl font-bold pt-4">{pack.name}</CardTitle>
               <CardDescription className="text-center">
                <span className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
                    <Coins className="text-yellow-400" />
                    {pack.credits}
                </span>
                <span className="text-muted-foreground">Credits</span>
              </CardDescription>
              <CardDescription className="text-center h-10 pt-2">{pack.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               {pack.features && (
                    <ul className="space-y-3">
                        {pack.features.map(feature => (
                        <li key={feature} className="flex items-start gap-3">
                            <Star className="size-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <div className="text-3xl font-bold text-center w-full">{pack.price}</div>
                 <Button className="w-full" onClick={() => handlePurchase(pack.name, pack.credits)}>
                    {pack.cta}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
