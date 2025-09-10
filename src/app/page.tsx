
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Bot, BarChart, Calendar, Video, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Content Creation',
    description:
      'Generate engaging social media posts in seconds. Our AI helps you craft the perfect message for your audience.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Analytics & Insights',
    description:
      'Track your performance with our detailed analytics. Understand what works and what doesn’t to grow your presence.',
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: 'Content Scheduling',
    description:
      'Plan your content in advance with our intuitive calendar. Never miss an opportunity to engage with your followers.',
  },
    {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: 'Video Generation',
    description:
      'Create stunning videos from text prompts using AI. Describe the scene you want to see, and watch it come to life.',
  },
];

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
      '5 Social Accounts',
      'AI Content Generation',
      'AI Caption Rewriter',
      'AI Hashtag Suggestions',
      'AI Trend Analysis',
      'Video Editor (50 credits)',
      'Advanced Analytics',
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
      'Team Collaboration Tools',
      'Video Editor (200 credits)',
      'Client Reporting',
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
                Supercharge Your Social Media with AI
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Trendix is the all-in-one platform to generate content, schedule posts, and analyze your performance. Effortlessly.
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
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything You Need to Go Viral
              </h2>
              <p className="mt-4 text-muted-foreground">
                From content creation to performance tracking, we've got you covered.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
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

        <section className="py-20 md:py-24  bg-background/50">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="items-center gap-12 grid lg:grid-cols-2">
                    <div>
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
                    <Image
                        src="https://picsum.photos/1200/800"
                        alt="Dashboard preview"
                        width={1200}
                        height={800}
                        data-ai-hint="dashboard analytics"
                        className="rounded-xl shadow-lg"
                    />
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
