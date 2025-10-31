
'use client';

import {
  Bell,
  BarChart,
  Calendar,
  MessageSquare,
  PenSquare,
  Settings,
  CreditCard,
  Facebook,
  Bot,
  Store,
  FileText,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const menuItems = [
    { href: '/meta-suite', label: 'Overview', icon: BarChart },
    { href: '/meta-suite/inbox', label: 'Inbox', icon: MessageSquare, badge: 12 },
    { href: '/meta-suite/planner', label: 'Planner', icon: Calendar },
    { href: '/meta-suite/ads', label: 'Ads', icon: Megaphone },
    { href: '/meta-suite/insights', label: 'Insights', icon: BarChart },
    { href: '/meta-suite/commerce', label: 'Commerce', icon: Store },
    { href: '/meta-suite/automation', label: 'Automation', icon: Bot },
    { href: '/meta-suite/all-tools', label: 'All tools', icon: FileText },
];

export default function MetaSuiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Facebook className="h-6 w-6 text-[#0866FF]" />
              <span className="">Meta Business Suite</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {menuItems.map(({ href, label, icon: Icon, badge }) => (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === href && 'bg-muted text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {badge && (
                    <div className="ml-auto flex h-6 w-9 items-center justify-center rounded-md bg-destructive text-destructive-foreground text-xs">
                        {badge}
                    </div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
