
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Zap, Puzzle, Sparkles, Pencil, Clapperboard, MessageSquareHeart, LayoutTemplate, Image, Music, FileText, Calendar, Brush, BarChart, Users } from "lucide-react";
import React from 'react';

const addons = [
  {
    title: "Social Media Manager AI",
    description: "Fully auto-manages posting, engagement, and replies across platforms.",
    category: "AI Assistants",
    icon: <Bot className="size-8 text-primary" />,
    status: "Active"
  },
  {
    title: "Strategy AI",
    description: "Builds monthly content calendars and plans your social strategy.",
    category: "AI Assistants",
    icon: <Calendar className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Creative AI",
    description: "Writes engaging captions, and generates videos & images.",
    category: "AI Assistants",
    icon: <Brush className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Analytics AI",
    description: "Interprets metrics, tracks performance, and recommends pivots.",
    category: "AI Assistants",
    icon: <BarChart className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Engagement AI",
    description: "Chats with followers, responds to comments, and builds community.",
    category: "AI Assistants",
    icon: <Users className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Ad Copywriter AI",
    description: "Generates high-converting ad copy and creatives in seconds.",
    category: "AI Assistants",
    icon: <Sparkles className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Trend Hunter AI",
    description: "Scans platforms daily and pushes trending hashtags/sounds to your dashboard.",
    category: "AI Assistants",
    icon: <Bot className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Brand Voice AI",
    description: "Trains on your past content and mimics your unique style and tone.",
    category: "AI Assistants",
    icon: <Pencil className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Community Manager AI",
    description: "Auto-responds to comments and DMs in your brand's voice to boost engagement.",
    category: "AI Assistants",
    icon: <MessageSquareHeart className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Video Script AI",
    description: "Generates engaging scripts for TikToks, Reels, and YouTube Shorts.",
    category: "AI Assistants",
    icon: <Clapperboard className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Cross-Posting Automation",
    description: "Auto-adapt and distribute your content for each social platform.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Activate"
  },
    {
    title: "Smart Reply Pack",
    description: "AI-suggested replies for DMs and comments to speed up engagement.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Engagement Booster Pack",
    description: "Auto-like and auto-follow relevant accounts with AI safety filters.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Smart Analytics Alerts",
    description: "Get notified when your engagement spikes or drops unexpectedly.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Activate"
  },
    {
    title: "Weekly Report Generator",
    description: "Automatically generates and sends weekly PDF reports to your clients.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Requires Setup"
  },
  {
    title: "Campaign Automation",
    description: "Schedule multi-day content campaigns with pre-built templates.",
    category: "Automations",
    icon: <Zap className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Canva Integration",
    description: "Access your Canva designs directly within Trendix.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "HubSpot Integration",
    description: "Sync contacts and marketing data with your HubSpot CRM.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Salesforce Integration",
    description: "Connect with Salesforce to manage leads and customer interactions.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Mailchimp Integration",
    description: "Integrate with Mailchimp to sync your email marketing campaigns.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Shopify Integration",
    description: "Connect your Shopify store to easily promote products.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Figma Integration",
    description: "Import your designs and assets directly from Figma.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Google Drive Integration",
    description: "Access and use your media from Google Drive.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Google Ads Integration",
    description: "Manage and track your Google Ad campaigns from Trendix.",
    category: "Integrations",
    icon: <Puzzle className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Template Packs",
    description: "Ready-made post templates for holidays, promotions, and memes.",
    category: "Premium Content",
    icon: <LayoutTemplate className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "AI Stock Assets",
    description: "AI-generated stock photos and videos curated for your niche.",
    category: "Premium Content",
    icon: <Image className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Music & Sound Packs",
    description: "Licensed music snippets and sound effects for Reels & TikToks.",
    category: "Premium Content",
    icon: <Music className="size-8 text-primary" />,
    status: "Activate"
  },
  {
    title: "Caption Packs",
    description: "Pre-written captions for various industries and occasions.",
    category: "Premium Content",
    icon: <FileText className="size-8 text-primary" />,
    status: "Activate"
  }
];

const categories = ["All", "AI Assistants", "Automations", "Integrations", "Premium Content", "Bundles"];

export default function StorePage() {
    const [filter, setFilter] = React.useState('All');
    
    const filteredAddons = filter === 'All' 
        ? addons 
        : addons.filter(addon => addon.category === filter);

  return (
    <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Trendix Store</h1>
            <p className="text-muted-foreground mt-2">
                Welcome to the marketplace. Enhance your workflow by activating powerful tools from Trendix and our community of third-party developers. Discover individual add-ons, subscribe to bundles, and find pricing that scales with your needs.
            </p>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <div className="flex justify-center">
                <TabsList className="flex-wrap h-auto">
                    {categories.map(category => (
                        <TabsTrigger key={category} value={category}>{category}</TabsTrigger>

                    ))}
                </TabsList>
            </div>
            
            <div className="mt-6">
                 {filter === 'Bundles' ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">App bundles are coming soon!</p>
                    </div>
                 ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAddons.map((addon) => (
                            <Card key={addon.title} className="flex flex-col">
                                <CardHeader className="flex-row items-start gap-4">
                                    {addon.icon}
                                    <div>
                                        <CardTitle>{addon.title}</CardTitle>
                                        <Badge variant="outline" className="mt-1">{addon.category}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>{addon.description}</CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" disabled={addon.status !== 'Activate'}>
                                        {addon.status}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Tabs>
    </div>
  );
}
