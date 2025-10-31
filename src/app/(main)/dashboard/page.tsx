

'use client';

import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/stats-card";
import { Twitter, Facebook, Instagram, Users, MessageSquare, TrendingUp, ArrowRight, Video, Mic, Text, Maximize, Loader2, Wand2, Music, Hash, AlertCircle, PenSquare, MicVocal, Megaphone, Plus } from "lucide-react";
import Link from 'next/link';
import { findTrends, type FindTrendsOutput } from '@/ai/flows/find-trends';
import { generateDashboardData, type GenerateDashboardDataOutput } from '@/ai/flows/generate-dashboard-data';
import { useProStatus } from '@/context/pro-status-context';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  fetchSocialAccounts,
  subscribeSocialAccounts,
  getCachedDashboardData,
  cacheDashboardData,
  subscribeDashboardCache,
  mergeSocialAccountData,
  type SocialAccount,
} from '@/services/dashboard-service';

// Lazy load heavy components for faster initial render
const EngagementChart = lazy(() => import("@/components/dashboard/engagement-chart"));
const PostsOverview = lazy(() => import("@/components/dashboard/posts-overview"));
const RecentVideos = lazy(() => import("@/components/dashboard/recent-videos"));

const TikTokIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6 text-muted-foreground"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.2-2.95-2.2-6.82 0-9.78 1.59-2.1 4.19-3.32 6.78-3.15.02 1.44-.01 2.89.01 4.33.01 1.49-.93 2.81-2.32 3.25-1.18.37-2.44.11-3.48-.61-.82-.58-1.34-1.49-1.32-2.58.02-1.11.56-2.14 1.43-2.71.84-.55 1.83-.75 2.82-.62.24 1.45.02 2.9.01 4.35-.01 1.77-1.2 3.32-2.81 3.78-1.28.36-2.66.07-3.69-.73-.91-.71-1.4-1.8-1.36-2.98.04-1.52.8-2.93 2.01-3.86 1.45-1.1 3.29-1.58 5.06-1.24.01 1.55.02 3.1.01 4.65z" />
    </svg>
  );

  const platformIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Twitter,
    Facebook,
    Instagram,
    TikTok: TikTokIcon,
  };

// Fallback data - shown immediately, no loading
// Fresh data for new users just getting started
const fallbackDashboardData: GenerateDashboardDataOutput = {
  socialStats: [
    { platform: 'Twitter', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'Facebook', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'Instagram', followers: '0', change: '+0%', changeType: 'positive' },
    { platform: 'TikTok', followers: '0', change: '+0%', changeType: 'positive' },
  ],
  engagementStats: [
    { metric: 'Likes', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Comments', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Shares', value: '0', change: '+0%', changeType: 'positive' },
    { metric: 'Reach', value: '0', change: '+0%', changeType: 'positive' },
  ],
  engagementChartData: [
    { month: 'Jul', engagement: 0 },
    { month: 'Aug', engagement: 0 },
    { month: 'Sep', engagement: 0 },
    { month: 'Oct', engagement: 0 },
    { month: 'Nov', engagement: 0 },
    { month: 'Dec', engagement: 0 },
    { month: 'Jan', engagement: 0 },
  ],
  postsOverview: [
    { content: 'Welcome to Trendix! 🎉 Ready to create amazing content? Let\'s get started!', platform: 'Twitter', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Your first post will appear here. Click "Create Post" to get started! 💫', platform: 'Instagram', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Start building your social media presence with AI-powered tools 🚀', platform: 'Facebook', status: 'Draft', date: 'Draft', engagement: '-' },
    { content: 'Connect your social accounts in Settings to see your real stats here 📊', platform: 'Twitter', status: 'Draft', date: 'Draft', engagement: '-' },
  ],
  recentVideos: [
    { title: 'Getting Started with Trendix', duration: '2:30', image: 'https://picsum.photos/300/200?random=101', aiHint: 'welcome tutorial' },
    { title: 'Create Your First Video', duration: '1:45', image: 'https://picsum.photos/300/200?random=102', aiHint: 'video creation guide' },
    { title: 'Connect Social Media Accounts', duration: '2:00', image: 'https://picsum.photos/300/200?random=103', aiHint: 'social media setup' },
    { title: 'AI Content Generation Tutorial', duration: '3:15', image: 'https://picsum.photos/300/200?random=104', aiHint: 'ai tools guide' },
  ],
};

const fallbackTrends = [
  { title: '#AITechTrends', type: 'hashtag' as const, description: 'Latest developments in artificial intelligence and technology innovation.' },
  { title: '#SocialMediaStrategy', type: 'hashtag' as const, description: 'Tips and insights for effective social media marketing and content creation.' },
  { title: '#ContentCreator', type: 'hashtag' as const, description: 'Community for content creators sharing their creative process and tips.' },
];

export default function DashboardPage() {
  const { isProPlan } = useProStatus();
  const [user, setUser] = useState<User | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Start with fallback data - NO loading state!
  const [trends, setTrends] = useState<FindTrendsOutput['trends']>(fallbackTrends);
  const [dashboardData, setDashboardData] = useState<GenerateDashboardDataOutput>(fallbackDashboardData);
  const [errorLoadingTrends, setErrorLoadingTrends] = useState(false);

  // Background data loading - optimized for speed, doesn't block UI
  const loadDataInBackground = async (userId: string, userName: string) => {
    const userContext = `The user is ${userName}, a social media manager for the tech startup Trendix.`;
    
    try {
      // Parallel fetch: cache and social accounts simultaneously
      const [cached, accounts] = await Promise.all([
        getCachedDashboardData(userId),
        fetchSocialAccounts(userId),
      ]);

      // Update UI immediately with cached data and accounts
      if (cached) {
        setDashboardData(cached.data);
        setTrends(cached.trends);
      }
      setSocialAccounts(accounts);

      // Only refresh if cache is stale or doesn't exist (skip if cache is fresh)
      const cacheAge = cached ? Date.now() - new Date(cached.lastUpdated).getTime() : Infinity;
      const shouldRefresh = !cached || cacheAge > 5 * 60 * 1000; // 5 minutes
      
      if (shouldRefresh) {
        setIsRefreshing(true);
        // Generate fresh data in background (non-blocking)
        Promise.all([
          findTrends({ industry: 'AI and Technology' }),
          generateDashboardData({ userContext }),
        ]).then(([trendsResult, dashboardDataResult]) => {
          setTrends(trendsResult.trends);
          
          // Merge with real social account data
          const mergedData = mergeSocialAccountData(dashboardDataResult, accounts);
          setDashboardData(mergedData);
          
          // Cache the results
          cacheDashboardData(userId, mergedData, trendsResult.trends);
          
          setErrorLoadingTrends(false);
          setIsRefreshing(false);
        }).catch((error) => {
          console.error('Background data refresh failed:', error);
          setIsRefreshing(false);
          // Don't show error if we have cached data
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
        
        // Load data in background - doesn't block UI
        loadDataInBackground(currentUser.uid, currentUser.displayName || 'User');
        
        // Subscribe to real-time social account updates
        const socialAccountsUnsubscribe = subscribeSocialAccounts(currentUser.uid, (accounts) => {
          setSocialAccounts(accounts);
          // Merge updated account data with current dashboard data
          setDashboardData(prev => mergeSocialAccountData(prev, accounts));
        });
        
        // Subscribe to real-time dashboard cache updates
        const cacheUnsubscribe = subscribeDashboardCache(currentUser.uid, (cached) => {
          if (cached) {
            setDashboardData(cached.data);
            setTrends(cached.trends);
          }
        });
        
        // Cleanup subscriptions
        return () => {
          socialAccountsUnsubscribe();
          cacheUnsubscribe();
        };
        } else {
            setUser(null);
        }
    });

    return () => authUnsubscribe();
  }, []);


  const videoQuickActions = [
    { label: "Text to Video", icon: Text, href: "/video-generator/editor" },
    { label: "Lip-Sync", icon: Mic, href: "/video-generator/editor" },
    { label: "Upscale Video", icon: Maximize, href: "/video-generator/editor" },
    { label: "Create Story", icon: Video, href: "/video-generator/editor" },
  ];

  const proTools = [
      { label: "Composer", icon: PenSquare, href: "/composer", description: "Generate & schedule posts" },
      { label: "Competitor Analysis", icon: Users, href: "/agency/competitor-analysis", description: "Analyze competitor strategies" },
      { label: "Social Listening", icon: MicVocal, href: "/agency/social-listening", description: "Monitor brand mentions" },
      { label: "Ad Assistant", icon: Megaphone, href: "/agency/ad-campaigns", description: "Create ad copy with AI" },
      { label: "Unified Inbox", icon: MessageSquare, href: "/agency/inbox", description: "Manage all conversations" },
      { label: "Trend Finder", icon: TrendingUp, href: "/composer", description: "Discover hot topics" },
  ]
  
  const trendIcons = useMemo(() => ({
    hashtag: <Hash className="size-5 text-primary" />,
    sound: <Music className="size-5 text-primary" />,
    challenge: <Wand2 className="size-5 text-primary" />,
  }), []);

  return (
    <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Welcome back, {user?.displayName || 'Explorer'}!</h1>
                  {isRefreshing && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Loader2 className="size-3 animate-spin" />
                      Updating...
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">Here's your all-in-one hub for social media and content creation.</p>
            </div>
            {isProPlan && (
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/video-generator/editor">
                            <Video className="mr-2" /> Create Video
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/composer">
                             <PenSquare className="mr-2" /> Create Post
                        </Link>
                    </Button>
                </div>
            )}
        </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.socialStats.map((stat) => {
          // Check if platform is actually connected
          const isConnected = socialAccounts.some(acc => acc.platform === stat.platform && acc.connected);
          return (
            <StatsCard
              key={stat.platform}
              platform={stat.platform}
              icon={platformIcons[stat.platform] || Users}
              followers={stat.followers}
              change={stat.change}
              changeType={stat.changeType as 'positive' | 'negative' | undefined}
              isConnected={isConnected}
            />
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
          <CardDescription>Track your audience engagement across all platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-[250px] w-full flex items-center justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}>
            <EngagementChart data={dashboardData.engagementChartData} />
          </Suspense>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            {dashboardData.engagementStats.map((stat) => (
              <div key={stat.metric}>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Users className="size-4" />
                  {stat.metric}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs font-medium ${stat.changeType === "negative" ? "text-red-500" : "text-green-500"}`}>
                  {stat.change} vs last month
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Card><CardHeader><CardTitle>Posts Overview</CardTitle></CardHeader><CardContent><div className="h-72 flex items-center justify-center"><Loader2 className="size-6 animate-spin" /></div></CardContent></Card>}>
            <PostsOverview posts={dashboardData.postsOverview} />
          </Suspense>
        </div>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Trend Finder
            </CardTitle>
            <CardDescription>Hot topics & sounds to inspire your next post.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {errorLoadingTrends ? (
              <div className="flex flex-col text-center justify-center items-center h-40 text-muted-foreground">
                <AlertCircle className="size-8 mb-2" />
                <p>Could not load trends.</p>
                <p className="text-xs">Please try again later.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {trends.slice(0, 3).map((trend) => (
                  <li key={trend.title} className="flex flex-col items-start gap-3 p-3 rounded-lg border bg-card/50">
                    <div className='flex items-start gap-3'>
                      <div>{trendIcons[trend.type as keyof typeof trendIcons]}</div>
                      <div>
                        <h4 className="font-semibold">{trend.title}</h4>
                        <p className="text-sm text-muted-foreground">{trend.description}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild className="mt-2 w-full">
                      <Link href={`/composer?topic=${encodeURIComponent(trend.title)}`}>
                        <Plus className="mr-2 size-3.5"/> Use Trend
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/composer">
                Find More Trends <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Suspense fallback={<Card><CardHeader><CardTitle>Recent Videos</CardTitle></CardHeader><CardContent><div className="h-48 flex items-center justify-center"><Loader2 className="size-6 animate-spin" /></div></CardContent></Card>}>
        <RecentVideos videos={dashboardData.recentVideos} />
      </Suspense>

        {isProPlan && (
        <Card>
            <CardHeader>
                <CardTitle>AI Social Media Tools</CardTitle>
                <CardDescription>Your suite of AI-powered tools for social media management.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proTools.map((tool) => (
                    <Button key={tool.label} variant="outline" asChild className="h-auto p-4 justify-start">
                        <Link href={tool.href}>
                            <tool.icon className="size-6 mr-4 text-primary" />
                            <div>
                                <p className="font-semibold">{tool.label}</p>
                                <p className="text-xs text-muted-foreground">{tool.description}</p>
                            </div>
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
      )}

    </div>
  );
}

    