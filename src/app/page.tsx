
'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay";
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRight, Bot, BarChart, Calendar, Video, Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Bot,
    title: 'AI Content Generation',
    description: 'Let AI create engaging social media posts, captions, and hashtags in seconds.',
  },
  {
    icon: Calendar,
    title: 'Content Scheduling',
    description: 'Plan and automate your content calendar across all your social media platforms.',
  },
  {
    icon: Video,
    title: 'AI Video Editor',
    description: 'Generate stunning videos from text prompts or existing images with our AI video tools.',
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Track your growth, monitor engagement, and understand your audience better.',
  },
   {
    icon: Palette,
    title: 'Image & Asset Library',
    description: 'Keep your brand assets organized and accessible in one central library.',
  },
]

const plans = [
  {
    name: 'Pro',
    price: '$49',
    description: 'For individual creators and small businesses ready to grow.',
    features: [
      'Up to 5 Social Accounts',
      'AI Content Generation',
      'AI Caption Rewriter',
      'AI Hashtag Suggestions',
      'Video Editor (50 credits/month)',
      'Advanced Analytics & Reporting',
      'Content Scheduling',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Agency',
    price: '$129',
    description: 'For agencies and marketing teams managing multiple clients.',
    features: [
      'Unlimited Social Accounts',
      'Team Collaboration Tools',
      'Video Editor (200 credits/month)',
      'White-label Client Reporting',
      'Priority Support',
    ],
    cta: 'Contact Sales',
  },
];


export default function LandingPage() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Trendix Logo.png"
            alt="Trendix Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Trendix</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Docs</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 text-center md:py-32 overflow-hidden bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
          >
            <source src="/trendix.mp4" type="video/mp4" />
          </video>
          
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <Carousel 
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  <CarouselItem>
                    <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                        The All-in-One Social Media Super-App
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                        Trendix combines content creation, scheduling, analytics, and an AI-powered video editor into one seamless platform.
                    </p>
                  </CarouselItem>
                  <CarouselItem>
                    <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                        AI-powered editor for everyone
                    </h1>
                     <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                        Think bigger. Edit faster.
                    </p>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>

              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Your Free Trial <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                 <Button size="lg" variant="outline">
                  See Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold">Everything You Need, Nothing You Don't</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Stop juggling multiple tools. Trendix brings your entire social media workflow under one roof.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-lg bg-primary/20 p-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full bg-card/20 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
             <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold">Simple Pricing for Teams of All Sizes</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that's right for you. Cancel anytime.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free Trial</CardTitle>
                        <CardDescription>Explore the core features.</CardDescription>
                        <div className="pt-4">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground">/ 14 days</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <ul className="space-y-3">
                        {['1 Social Account', 'AI Content Generation (10 posts)', 'Basic Analytics'].map(feature => (
                        <li key={feature} className="flex items-center gap-3">
                            <Check className="size-5 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                        ))}
                    </ul>
                    </CardContent>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link href="/signup">Start Trial</Link>
                        </Button>
                    </CardContent>
                </Card>
              {plans.map((plan) => (
                <Card key={plan.name} className="flex flex-col border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                     <div className="pt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/ month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                        {plan.features.map(feature => (
                        <li key={feature} className="flex items-center gap-3">
                            <Check className="size-5 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                        </li>
                        ))}
                    </ul>
                  </CardContent>
                  <CardContent>
                    <Button className="w-full">{plan.cta}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

       <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Image
                src="/Trendix Logo.png"
                alt="Trendix Logo"
                width={24}
                height={24}
            />
            <p className="text-sm text-muted-foreground">&copy; 2024 Trendix, Inc. All rights reserved.</p>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
