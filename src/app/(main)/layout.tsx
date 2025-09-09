

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
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
  Book,
  Scale,
  MessageSquare,
  Bell,
  Users,
  Megaphone,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import SplashScreen from '@/components/splash-screen';
import { useLoading } from '@/context/loading-context';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/composer', icon: PenSquare, label: 'Composer' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/library', icon: Library, label: 'Library' },
];


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const { showLoading, hideLoading, isLoading } = useLoading();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAgencyOpen, setIsAgencyOpen] = useState(pathname.startsWith('/agency'));
  const [selectedClient, setSelectedClient] = useState('trendix');


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
    if (pathname.startsWith('/agency')) {
      setIsAgencyOpen(true);
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
    if (pathname.startsWith('/video-generator/editor')) return 'Video Editor';
    if (pathname.startsWith('/agency/competitor-analysis')) return 'Competitor Analysis';
    if (pathname.startsWith('/agency/social-listening')) return 'Social Listening';
    if (pathname.startsWith('/agency/team')) return 'Team Management';
    if (pathname.startsWith('/agency/inbox')) return 'Unified Inbox';
    if (pathname.startsWith('/agency/ad-campaigns')) return 'Ad Campaign Assistant';
    
    const currentNavItem = navItems.find(item => pathname === item.href);
    if (currentNavItem) return currentNavItem.label;

    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/library')) return 'Library';

    return 'Dashboard';
  }

  return (
    <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
              <Link href="/dashboard" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, '/dashboard')}>
                  <Image
                    src="/Trendix Logo.png"
                    alt="Trendix Logo"
                    width={28}
                    height={28}
                    className="size-7"
                  />
                <h1 className="text-lg font-semibold text-foreground group-hover:inline hidden">Trendix</h1>
              </Link>
          </SidebarHeader>
          <SidebarContent className="hide-scrollbar">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{
                      children: item.label,
                    }}
                  >
                    <Link href={item.href} onClick={(e) => handleNavClick(e, item.href)}>
                      <item.icon />
                      <span className="group-hover:inline hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith('/video-generator/editor')}
                    tooltip={{
                      children: "Video Editor",
                    }}
                  >
                    <Link href="/video-generator/editor" onClick={(e) => handleNavClick(e, '/video-generator/editor')}>
                      <Video />
                      <span className="group-hover:inline hidden">Video Editor</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <Collapsible open={isAgencyOpen} onOpenChange={setIsAgencyOpen}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                className="w-full"
                                tooltip={{ children: 'Agency Tools' }}
                            >
                                <Scale/>
                                <span className="group-hover:inline hidden">Agency Tools</span>
                                <ChevronDown className="ml-auto size-4 transition-transform data-[state=open]:rotate-180 group-hover:inline hidden" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent asChild>
                        <SidebarMenuSub>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={pathname === '/agency/inbox'}>
                                    <Link href="/agency/inbox" onClick={(e) => handleNavClick(e, '/agency/inbox')}>
                                        <span>Unified Inbox</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={pathname === '/agency/competitor-analysis'}>
                                    <Link href="/agency/competitor-analysis" onClick={(e) => handleNavClick(e, '/agency/competitor-analysis')}>
                                        <span>Competitor Analysis</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={pathname === '/agency/social-listening'}>
                                    <Link href="/agency/social-listening" onClick={(e) => handleNavClick(e, '/agency/social-listening')}>
                                        <span>Social Listening</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={pathname === '/agency/ad-campaigns'}>
                                    <Link href="/agency/ad-campaigns" onClick={(e) => handleNavClick(e, '/agency/ad-campaigns')}>
                                        <span>Ad Assistant</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                             <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={pathname === '/agency/team'}>
                                    <Link href="/agency/team" onClick={(e) => handleNavClick(e, '/agency/team')}>
                                        <span>Team Management</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
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
                      <span className="group-hover:inline hidden">Tutorials</span>
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
                    <span className="group-hover:inline hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className='flex items-center justify-between group-hover:w-[calc(var(--sidebar-width)_-_theme(spacing.4))] justify-center'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start h-12 gap-2 px-2 group-hover:w-full h-10 w-10 px-0 justify-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="avatar" alt="User Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start group-hover:flex hidden">
                          <span className="text-sm font-medium text-foreground">Jane Doe</span>
                          <span className="text-xs text-muted-foreground">jane.doe@email.com</span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 group-hover:inline-flex hidden" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2" align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="w-[180px] h-9 hidden md:flex">
                        <div className="flex items-center gap-2">
                            <Briefcase className="size-4" />
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="trendix">Trendix</SelectItem>
                        <SelectItem value="client_a">Client A</SelectItem>
                        <SelectItem value="client_b">Client B</SelectItem>
                    </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="relative h-9 w-9">
                            <Bell className="size-4" />
                             <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">2</Badge>
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <div className="flex items-start gap-3">
                                <Avatar className="size-8">
                                    <AvatarImage src="https://picsum.photos/100/100?random=5" data-ai-hint="avatar"/>
                                    <AvatarFallback>AJ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">New mention from @alicej</p>
                                    <p className="text-xs text-muted-foreground">Just wanted to say I love your new feature!...</p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                            <div className="flex items-start gap-3">
                                 <Avatar className="size-8">
                                    <AvatarImage src="https://picsum.photos/100/100?random=6" data-ai-hint="avatar"/>
                                    <AvatarFallback>BW</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">New DM from bobw</p>
                                    <p className="text-xs text-muted-foreground">Can you tell me more about your pricing...</p>
                                </div>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
