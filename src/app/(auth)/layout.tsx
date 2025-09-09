import type { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/Trendix Logo.png"
            alt="Trendix Logo"
            width={80}
            height={80}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
