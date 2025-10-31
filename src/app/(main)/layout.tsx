

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
  Briefcase,
  MicVocal,
  Search,
  BarChart,
  UserPlus,
  Store,
  Youtube,
  CreditCard,
  Star,
  Lock,
  Cpu,
  Bot,
  Coins,
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
import { cn } from '@/lib/utils';
import { useProStatus } from '@/context/pro-status-context';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import TrendixAssistant from '@/components/trendix-assistant';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/composer', icon: PenSquare, label: 'Composer' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/library', icon: Library, label: 'Library' },
  { href: '/campaigns', icon: Bot, label: 'Campaigns' },
  { href: '/store', icon: Store, label: 'Store' },
];


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [initialAuthCheck, setInitialAuthCheck] = useState(true);
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { isProPlan, isAgencyPlan, credits } = useProStatus();
  const [user, setUser] = useState<User | null>(null);
  const [isAgencyOpen, setIsAgencyOpen] = useState(pathname.startsWith('/agency'));
  const [selectedClient, setSelectedClient] = useState('trendix');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            router.replace('/login');
        }
        setInitialAuthCheck(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);
  
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== href) {
      showLoading();
    }
  }, [pathname, showLoading]);
  
  const handleLogout = () => {
    showLoading();
    auth.signOut().then(() => {
        localStorage.removeItem('auth-token');
        router.push('/');
    }).finally(() => {
        hideLoading();
    });
  };
  
  useEffect(() => {
    if (pathname.startsWith('/agency')) {
      setIsAgencyOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if(!initialAuthCheck) {
        hideLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, initialAuthCheck]);


  if (initialAuthCheck) {
    return <SplashScreen />;
  }

  const getPageTitle = () => {
    if (pathname.startsWith('/video-generator/editor')) return 'Video Editor';
    if (pathname.startsWith('/agency/competitor-analysis')) return 'Competitor Analysis';
    if (pathname.startsWith('/agency/social-listening')) return 'Social Listening';
    if (pathname.startsWith('/agency/team')) return 'Team Management';
    if (pathname.startsWith('/agency/inbox')) return 'Unified Inbox';
    if (pathname.startsWith('/agency/ad-campaigns')) return 'Ad Campaign Assistant';
    if (pathname.startsWith('/store/engagement-booster')) return 'Engagement Booster';
    if (pathname.startsWith('/store')) return 'Trendix Store';
    if (pathname.startsWith('/youtube-studio/go-live')) return 'Go Live';
    if (pathname.startsWith('/youtube-studio')) return 'YouTube Studio';
    if (pathname.startsWith('/pricing/buy-credits')) return 'Buy Credits';
    if (pathname.startsWith('/pricing')) return 'Pricing & Plans';
    if (pathname.startsWith('/campaigns')) return 'Campaigns';
    
    const currentNavItem = navItems.find(item => pathname.startsWith(item.href));
    if (currentNavItem) return currentNavItem.label;

    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/tutorials')) return 'Tutorials';

    return 'Dashboard';
  }

  return (
    <SidebarProvider defaultOpen={false}>
        <Sidebar>
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
                    isActive={pathname.startsWith(item.href)}
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
                    isActive={pathname.startsWith('/video-generator')}
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

                 <SidebarMenuItem>
                   <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith('/youtube-studio')}
                        tooltip={{ children: 'YouTube Studio' }}
                    >
                        <Link href="/youtube-studio" onClick={(e) => handleNavClick(e, '/youtube-studio')}>
                            <Youtube />
                            <span className="group-hover:inline hidden">YouTube Studio</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <Collapsible open={isAgencyOpen && isAgencyPlan} onOpenChange={setIsAgencyOpen} disabled={!isAgencyPlan}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild disabled={!isAgencyPlan}>
                       <SidebarMenuButton
                            asChild={!isAgencyPlan}
                            className={cn("w-full", !isAgencyPlan && "cursor-not-allowed opacity-50")}
                            tooltip={{ children: 'Agency Tools - Upgrade Required' }}
                        >
                           {isAgencyPlan ? (
                                <>
                                    <Scale />
                                    <span className="group-hover:inline hidden">Agency Tools</span>
                                    <ChevronDown className="ml-auto size-4 transition-transform data-[state=open]:rotate-180 group-hover:inline hidden" />
                                </>
                           ) : (
                             <Link href="/pricing" className="w-full">
                                    <Lock />
                                    <span className="group-hover:inline hidden">Agency Tools</span>
                                     <Badge variant="secondary" className="ml-auto group-hover:inline hidden">Pro</Badge>
                             </Link>
                           )}
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
                    <Link href="/tutorials" onClick={(e) => handleNavClick(e, '/tutorials')}>
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
                        isActive={pathname.startsWith('/pricing/buy-credits')}
                        tooltip={{ children: 'Buy Credits' }}
                    >
                        <Link href="/pricing/buy-credits" onClick={(e) => handleNavClick(e, '/pricing/buy-credits')}>
                            <Coins />
                            <span className="group-hover:inline hidden">Buy Credits</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
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
                        <AvatarImage src={user?.photoURL || "https://picsum.photos/100/100"} data-ai-hint="avatar" alt="User Avatar" />
                        <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-col items-start group-hover:flex hidden">
                          <span className="text-sm font-medium text-foreground">{user?.displayName || 'User'}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 group-hover:inline-flex hidden" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mb-2" align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pricing">
                        <CreditCard className="mr-2" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
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
                <div className='hidden md:flex items-center gap-2'>
                    <Badge variant='outline' className='gap-2 border-primary/50 text-primary'>
                        <Coins className='size-3.5' />
                        {credits} Credits
                    </Badge>
                    <Badge variant="outline" className="border-primary/50 text-primary">
                        <Star className="mr-2 size-3.5" />
                        {isAgencyPlan ? 'Agency Plan' : isProPlan ? 'Pro Plan' : 'Free Trial'}
                    </Badge>
                    {!isProPlan && (
                      <Button variant="default" size="sm" asChild>
                          <Link href="/pricing">Go Pro</Link>
                      </Button>
                    )}
                </div>
                
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
              <Button size="sm" asChild>
                <Link href="/composer"><Plus className="mr-2 size-4" /> Create</Link>
              </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 relative">
           <div className="absolute inset-0 -z-10 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]" />
          {children}
        </main>
      </SidebarInset>
      {/* Trendix AI Assistant - Available throughout the app */}
      <TrendixAssistant context={pathname.split('/')[1] || 'dashboard'} />
    </SidebarProvider>
  );
}
