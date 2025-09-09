
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  ChevronDown,
} from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useState } from 'react';

const videoNavItems = [
    { href: '/video-generator/text-to-video', icon: Text, label: 'Text to Video' },
    { href: '/video-generator/image-to-video', icon: ImageIcon, label: 'Image to Video' },
    { href: '/video-generator/elements-to-video', icon: Shapes, label: 'Elements to Video' },
    { href: '/video-generator/add-audio', icon: Music, label: 'Add Audio to Video' },
    { href: '/video-generator/video-upscale', icon: Maximize, label: 'Video Upscale' },
    { href: '/video-generator/lip-sync', icon: Mic, label: 'Lip-Sync Video' },
];

export default function VideoGeneratorSidebar() {
  const pathname = usePathname();
  const [isVideoOpen, setIsVideoOpen] = useState(true);

  const isVideoGeneratorPage = pathname.startsWith('/video-generator');

  // A bit of a hack to handle the two modes on the same page
  const textToVideoActive = pathname === '/video-generator' || pathname === '/video-generator/text-to-video';
  const imageToVideoActive = pathname === '/video-generator/image-to-video';


  return (
    <div className="w-64 border-r bg-card/50 p-2 flex flex-col z-10">
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
      <div className="flex-1 flex flex-col overflow-y-auto">
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible open={isVideoOpen} onOpenChange={setIsVideoOpen} className="w-full">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isVideoGeneratorPage} className='w-full justify-between'>
                        <div className="flex items-center gap-2">
                            <Video />
                            <span>Video</span>
                        </div>
                        <ChevronDown className={`size-4 transition-transform ${isVideoOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                <SidebarMenu className="ml-4 mt-2 border-l pl-4 space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={textToVideoActive} href="/video-generator" variant="ghost" size="sm">
                            <Link href="/video-generator">
                                <Text className="size-3.5" />
                                <span>Text to Video</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={imageToVideoActive} href="/video-generator" variant="ghost" size="sm">
                            <Link href="/video-generator">
                                <ImageIcon className="size-3.5" />
                                <span>Image to Video</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {videoNavItems.slice(2).map((item) => (
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
      </div>
      <div className="mt-auto p-2">
        <div className="p-2 space-y-1">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Help & Support</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">News & Updates</Link>
        </div>
      </div>
    </div>
  );
}
