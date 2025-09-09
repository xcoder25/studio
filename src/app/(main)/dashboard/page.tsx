
'use client';

import type { SVGProps } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/stats-card";
import EngagementChart from "@/components/dashboard/engagement-chart";
import PostsOverview from "@/components/dashboard/posts-overview";
import VideoStats from '@/components/dashboard/video-stats';
import RecentVideos from '@/components/dashboard/recent-videos';
import { Twitter, Facebook, Instagram, Users, ThumbsUp, MessageSquare, Share2, TrendingUp, ArrowRight, Video, Mic, Text, Maximize, Loader2, Wand2, Music, Hash } from "lucide-react";
import Link from 'next/link';
import { findTrends, type FindTrendsOutput } from '@/ai/flows/find-trends';

export default function DashboardPage() {
  const [trends, setTrends] = useState<FindTrendsOutput['trends']>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);

  useEffect(() => {
    async function loadTrends() {
      setIsLoadingTrends(true);
      try {
        const result = await findTrends({ industry: 'AI and Technology' });
        setTrends(result.trends);
      } catch (error) {
        console.error('Failed to load trends:', error);
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

      <div className="grid md:grid-cols-3 gap-6">
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
            ) : (
            <ul className="space-y-4">
                {trends.map((trend) => (
                  <li key={trend.title} className="flex items-start gap-4">
                    <div>{trendIcons[trend.type]}</div>
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
            <Button variant="outline" className="w-full">
              Explore More Trends <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
