
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Bot, BarChart, Calendar, Video, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const pricingPlans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'for 14 days',
    description: 'Explore the core features of Trendix.',
    features: [
      '1 Facebook Page',
      '1 Instagram Account',
      'AI Content Generation',
      'Video Editor (5 credits)',
    ],
    cta: 'Start Your Free Trial',
    ctaLink: '/signup'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/ month',
    description: 'For creators and small businesses.',
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
    cta: 'Choose Pro',
    popular: true,
    ctaLink: '/pricing'
  },
  {
    name: 'Agency',
    price: '$129',
    period: '/ month',
    description: 'For agencies and marketing teams.',
    features: [
      'Unlimited Social Accounts',
      'Team Collaboration Tools (3 seats)',
      'Video Editor (200 credits/month)',
      'White-label Client Reporting',
      'Priority Support',
    ],
    cta: 'Contact Sales',
    ctaLink: '/pricing'
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Trendix Logo.png"
            alt="Trendix Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Trendix</span>
        </Link>
        <nav className="flex items-center gap-2">
            <Link href="#features" className={cn(buttonVariants({ variant: 'ghost' }))}>Features</Link>
            <Link href="#pricing" className={cn(buttonVariants({ variant: 'ghost' }))}>Pricing</Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost' }))}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative py-20 text-center md:py-32">
            <div
                className="absolute inset-0 z-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"
            />
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                Your All-in-One Social Media & Content Creation Studio
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Let our AI manage multiple social accounts, so you can focus on what matters most. Generate content, schedule posts, create videos, and analyze performance—all in one place.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: 'lg' }))}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-24 bg-background/50">
            <div className="container mx-auto px-4 md:px-6 space-y-24">
                 <div className="items-center gap-12 grid lg:grid-cols-2">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            AI-Powered Content Creation
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            From a simple idea to a polished post, our AI content composer is your ultimate creative partner. Generate engaging copy, find trending hashtags, and rewrite captions in any tone to perfectly match your brand's voice.
                        </p>
                         <div className="mt-8 flex gap-4">
                            <Link
                            href="/signup"
                            className={cn(buttonVariants())}
                            >
                            Start Creating
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <Image
                            src="https://picsum.photos/seed/composer/1200/800"
                            alt="Content Composer"
                            width={1200}
                            height={800}
                            data-ai-hint="content creation social media"
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                 </div>

                 <div className="items-center gap-12 grid lg:grid-cols-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                           Turn Text into Viral Videos
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                           Describe the video you want to create, and our AI video generator will bring it to life. Create stunning visuals, animated stories, and lip-synced videos from just a text prompt or an image, ready for any platform.
                        </p>
                         <div className="mt-8 flex gap-4">
                             <Link
                                href="/signup"
                                className={cn(buttonVariants())}
                                >
                                Generate Your First Video
                            </Link>
                        </div>
                    </div>
                     <Image
                        src="https://picsum.photos/seed/videoedit/1200/800"
                        alt="Video Editor"
                        width={1200}
                        height={800}
                        data-ai-hint="video editing interface"
                        className="rounded-xl shadow-lg"
                    />
                 </div>

                 <div className="items-center gap-12 grid lg:grid-cols-2">
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Visualize Your Success
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Our dashboard provides a clear overview of your social media performance. Track key metrics, understand your audience, and make data-driven decisions to boost your engagement.
                        </p>
                         <div className="mt-8 flex gap-4">
                            <Link
                            href="/signup"
                            className={cn(buttonVariants())}
                            >
                            Explore Dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <Image
                            src="/landing.png"
                            alt="Dashboard preview"
                            width={1200}
                            height={800}
                            data-ai-hint="dashboard analytics"
                            className="rounded-xl shadow-lg"
                        />
                    </div>
                 </div>
            </div>
        </section>
        
        <section id="pricing" className="py-20 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Find a Plan That's Right for You
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Start for free and scale up as you grow. No hidden fees.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {pricingPlans.map((plan) => (
                        <Card key={plan.name} className={cn("flex flex-col", plan.popular && "border-primary ring-2 ring-primary")}>
                            <CardHeader>
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
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="size-5 text-primary" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Image
                src="/Trendix Logo.png"
                alt="Trendix Logo"
                width={24}
                height={24}
            />
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Trendix. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex gap-4 md:mt-0">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
                </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
