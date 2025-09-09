import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Trendix Logo.png"
              alt="Trendix Logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold">Trendix</h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
