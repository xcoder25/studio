

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, type ReactNode, useCallback } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Calendar,
  PenSquare,
  Library,
  Settings,
  ChevronDown,
  Video,
  Plus,
  Text,
  ImageIcon,
  Shapes,
  Music,
  Maximize,
  Mic,
  Book,
  Scissors,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SplashScreen from '@/components/splash-screen';
import { useLoading } from '@/context/loading-context';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/composer', icon: PenSquare, label: 'Composer' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/library', icon: Library, label: 'Library' },
];

const videoNavItems = [
    { href: '/video-generator/editor', icon: Scissors, label: 'Video Editor' },
    { href: '/video-generator', icon: Text, label: 'Text to Video' },
    { href: '/video-generator/image-to-video', icon: ImageIcon, label: 'Image to Video' },
    { href: '/video-generator/add-audio', icon: Music, label: 'Add Audio to Video' },
    { href: '/video-generator/video-upscale', icon: Maximize, label: 'Video Upscale' },
    { href: '/video-generator/lip-sync', icon: Mic, label: 'Lip-Sync Video' },
];


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const { showLoading, hideLoading, isLoading } = useLoading();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(pathname.startsWith('/video-generator'));


  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href) {
      showLoading();
    }
  }, [pathname, showLoading]);
  
  const handleLogout = () => {
    showLoading();
    localStorage.removeItem('auth-token');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };
  
  useEffect(() => {
    if (pathname.startsWith('/video-generator')) {
      setIsVideoOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if(!initialLoading) {
        hideLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  if (!isAuthenticated || initialLoading) {
    return <SplashScreen />;
  }

  const getPageTitle = () => {
    const allNavItems = [...navItems, ...videoNavItems, { href: '/settings', label: 'Settings'}, { href: '/library', label: 'Library' }];
    const currentNavItem = allNavItems.find(item => pathname === item.href);
    if (currentNavItem) return currentNavItem.label;

    if (pathname.startsWith('/video-generator')) return 'Video Generator';

    return 'Dashboard';
  }

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, '/dashboard')}>
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
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href === '/library' && pathname === '/templates')}
                    tooltip={{
                      children: item.label,
                    }}
                  >
                    <Link href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
               <Collapsible open={isVideoOpen} onOpenChange={setIsVideoOpen} className="w-full">
                  <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={pathname.startsWith('/video-generator')} className='w-full justify-between'>
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
                          {videoNavItems.map((item) => (
                              <SidebarMenuItem key={item.label}>
                                  <SidebarMenuButton asChild isActive={pathname === item.href} href={item.href} variant="ghost" size="sm" onClick={(e) => handleNavClick(e as any, item.href)}>
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
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/tutorials')}
                    tooltip={{
                      children: "Tutorials",
                    }}
                  >
                    <Link href="#" onClick={(e) => handleNavClick(e, '/tutorials')}>
                      <Book />
                      <span>Tutorials</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="gap-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/settings')}
                  tooltip={{ children: 'Settings' }}
                >
                  <Link href="/settings" onClick={(e) => handleNavClick(e, '/settings')}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-12 gap-2 px-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="avatar" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-foreground">Jane Doe</span>
                      <span className="text-xs text-muted-foreground">jane.doe@email.com</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <h2 className="text-xl font-semibold">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Credits:</span>
              <span className="font-semibold">40/40</span>
              <Button variant="outline" size="sm">Upgrade</Button>
              <Button size="sm"><Plus className="mr-2 size-4" /> Create</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 relative">
           <div className="absolute inset-0 -z-10 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
