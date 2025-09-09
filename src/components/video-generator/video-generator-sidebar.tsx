
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Video,
  Text,
  ImageIcon,
  Shapes,
  Music,
  Maximize,
  Mic,
  Book,
  Settings,
} from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const videoNavItems = [
    { href: '/video-generator/text-to-video', icon: Text, label: 'Text to Video' },
    { href: '/video-generator/image-to-video', icon: ImageIcon, label: 'Image to Video' },
    { href: '/video-generator/elements-to-video', icon: Shapes, label: 'Elements to Video' },
    { href: '/video-generator/add-audio', icon: Music, label: 'Add Audio to Video' },
    { href: '/video-generator/upscale', icon: Maximize, label: 'Video Upscale' },
    { href: '/video-generator/lip-sync', icon: Mic, label: 'Lip-Sync Video' },
];

export default function VideoGeneratorSidebar() {
  const pathname = usePathname();
  const [isVideOpen, setIsVideoOpen] = useState(true);

  return (
    <Sidebar className="w-64 border-r bg-card/20 p-2">
      <SidebarHeader className='p-0'>
        <div className="flex items-center gap-2 p-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/Trendix Logo.png"
              alt="Trendix Logo"
              width={28}
              height={28}
              className="size-7"
            />
            <h1 className="text-lg font-semibold text-foreground">Trendix</h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible open={isVideOpen} onOpenChange={setIsVideoOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={pathname.startsWith('/video-generator')} className='w-full'>
                        <Video />
                        <span>Video</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                <SidebarMenu className="ml-4 mt-2 border-l pl-4 space-y-1">
                    {videoNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={pathname === item.href} variant="ghost" size="sm">
                            <Link href={item.href}>
                                <item.icon className="size-3.5" />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/tutorials')}>
              <Link href="/tutorials">
                <Book />
                <span>Tutorials</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-0'>
        <div className="p-2 space-y-2">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Help & Support</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">News & Updates</Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
