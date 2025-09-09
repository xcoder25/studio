
'use client';

import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="animate-bounce-subtle">
        <Image
          src="/Trendix Logo.png"
          alt="Trendix Logo"
          width={128}
          height={128}
          priority
        />
      </div>
    </div>
  );
}
