import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from '@/context/loading-context';
import { ProStatusProvider } from '@/context/pro-status-context';
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Trendix',
  description: 'Trendix: The All-in-One AI-Powered Social Media Manager and Content Creation Studio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <ProStatusProvider>
            <LoadingProvider>
            {children}
            </LoadingProvider>
        </ProStatusProvider>
        <Toaster />
      </body>
    </html>
  );
}
