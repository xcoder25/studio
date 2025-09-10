

'use client';

import type { SVGProps } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/stats-card";
import EngagementChart from "@/components/dashboard/engagement-chart";
import PostsOverview from "@/components/dashboard/posts-overview";
import VideoStats from '@/components/dashboard/video-stats';
import RecentVideos from '@/components/dashboard/recent-videos';
import { Twitter, Facebook, Instagram, Users, ThumbsUp, MessageSquare, Share2, TrendingUp, ArrowRight, Video, Mic, Text, Maximize, Loader2, Wand2, Music, Hash, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { findTrends, type FindTrendsOutput } from '@/ai/flows/find-trends';

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

export default function DashboardPage() {
  const [trends, setTrends] = useState<FindTrendsOutput['trends']>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);
  const [errorLoadingTrends, setErrorLoadingTrends] = useState(false);

  useEffect(() => {
    async function loadTrends() {
      setIsLoadingTrends(true);
      setErrorLoadingTrends(false);
      try {
        const result = await findTrends({ industry: 'AI and Technology' });
        if (result.trends.length === 0) {
            setErrorLoadingTrends(true);
        }
        setTrends(result.trends);
      } catch (error) {
        console.error('Failed to load trends:', error);
        setErrorLoadingTrends(true);
      } finally {
        setIsLoadingTrends(false);
      }
    }
    loadTrends();
  }, []);

  const socialStats = [
    {
      platform: "Twitter",
      icon: Twitter,
      followers: "12.5K",
      change: "+12.2%",
      color: "bg-sky-500",
    },
    {
      platform: "Facebook",
      icon: Facebook,
      followers: "8.2K",
      change: "+8.1%",
      color: "bg-blue-600",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      followers: "24.1K",
      change: "-2.3%",
      changeType: "negative",
      color: "bg-fuchsia-600",
    },
    {
      platform: "TikTok",
      icon: TikTokIcon,
      followers: "48.7K",
      change: "+25.5%",
      color: "bg-black",
    },
  ];

  const engagementStats = [
    {
      metric: "Likes",
      icon: ThumbsUp,
      value: "42.8K",
      change: "+21%",
    },
    {
      metric: "Comments",
      icon: MessageSquare,
      value: "10.3K",
      change: "+15%",
    },
    {
      metric: "Shares",
      icon: Share2,
      value: "6.7K",
      change: "-5%",
      changeType: "negative",
    },
    {
      metric: "Reach",
      icon: Users,
      value: "1.2M",
      change: "+30%",
    },
  ];

  const videoQuickActions = [
    { label: "Text to Video", icon: Text, href: "/video-generator/editor" },
    { label: "Lip-Sync", icon: Mic, href: "/video-generator/editor" },
    { label: "Upscale Video", icon: Maximize, href: "/video-generator/editor" },
    { label: "Create Story", icon: Video, href: "/video-generator/editor" },
  ];
  
  const trendIcons = {
    hashtag: <Hash className="size-5 text-primary" />,
    sound: <Music className="size-5 text-primary" />,
    challenge: <Wand2 className="size-5 text-primary" />,
  }

  return (
    <div className="grid gap-6">
      
      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoStats />
          </div>
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump right into video creation.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {videoQuickActions.map((action) => (
                <Button key={action.label} variant="outline" asChild>
                  <Link href={action.href} className='flex items-center justify-center gap-2'>
                    <action.icon className="size-4" />
                    <span>{action.label}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
      </div>

      <RecentVideos />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialStats.map((stat) => (
          <StatsCard
            key={stat.platform}
            platform={stat.platform}
            icon={stat.icon as React.FC<SVGProps<SVGSVGElement>>}
            followers={stat.followers}
            change={stat.change}
            changeType={stat.changeType as 'positive' | 'negative' | undefined}
            color={stat.color}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Overview</CardTitle>
          <CardDescription>Track your audience engagement across all platforms.</CardDescription>
        </CardHeader>
        <CardContent>
          <EngagementChart />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            {engagementStats.map((stat) => (
              <div key={stat.metric}>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <stat.icon className="size-4" />
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
          <PostsOverview />
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
            {isLoadingTrends ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : errorLoadingTrends ? (
              <div className="flex flex-col text-center justify-center items-center h-40 text-muted-foreground">
                <AlertCircle className="size-8 mb-2" />
                <p>Could not load trends.</p>
                <p className="text-xs">Please try again later.</p>
              </div>
            ) : (
            <ul className="space-y-4">
                {trends.slice(0, 3).map((trend) => (
                  <li key={trend.title} className="flex items-start gap-4">
                    <div>{trendIcons[trend.type as keyof typeof trendIcons]}</div>
                    <div>
                      <h4 className="font-semibold">{trend.title}</h4>
                      <p className="text-sm text-muted-foreground">{trend.description}</p>
                    </div>
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
    </div>
  );
}
