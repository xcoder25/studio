
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Bot, BarChart, Calendar, Video, Palette, Check, Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
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
        <nav className="hidden md:flex items-center gap-4">
            <Link href="#" className={cn(buttonVariants({ variant: 'ghost' }))}>Products <ChevronDown className="ml-1 size-4"/></Link>
            <Link href="#" className={cn(buttonVariants({ variant: 'ghost' }))}>AI tools <Badge variant="destructive" className="ml-1">Hot</Badge></Link>
            <Link href="#" className={cn(buttonVariants({ variant: 'ghost' }))}>Solutions <ChevronDown className="ml-1 size-4"/></Link>
            <Link href="#" className={cn(buttonVariants({ variant: 'ghost' }))}>Resources <ChevronDown className="ml-1 size-4"/></Link>
            <Link href="#" className={cn(buttonVariants({ variant: 'ghost' }))}>NewsRoom <ChevronDown className="ml-1 size-4"/></Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Try Trendix Online
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Download
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <section className="relative w-full py-20 text-center md:py-32">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="https://picsum.photos/seed/hero-bg/1920/1080"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-20"
                    data-ai-hint="dark mountain abstract"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            </div>
          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <Badge variant="outline" className="mb-6 px-3 py-1 text-sm">
                <Sparkles className="mr-2 size-4"/>
                All-in-one
              </Badge>
              <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                AI-powered editor for everyone
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Think bigger. Edit faster.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg">
                  Download
                </Button>
                 <Button size="lg" variant="outline">
                  Try online
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
