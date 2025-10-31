
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is a temporary redirect. The new inbox is at /meta-suite/inbox
export default function LegacyInboxPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/meta-suite/inbox');
  }, [router]);

  return null; 
}
