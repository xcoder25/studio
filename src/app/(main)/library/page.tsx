
'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayCircle, MoreHorizontal } from "lucide-react";
import Link from 'next/link';

const templates = [
  {
    title: "New Feature Announcement",
    category: "Announcement",
    image: "https://picsum.photos/seed/1/600/400",
    aiHint: "technology abstract",
  },
  {
    title: "Tech Insight Infographic",
    category: "Informative",
    image: "https://picsum.photos/seed/2/600/400",
    aiHint: "data visualization",
  },
  {
    title: "Quote of the Day",
    category: "Inspirational",
    image: "https://picsum.photos/seed/3/600/400",
    aiHint: "nature landscape",
  },
  {
    title: "Behind the Scenes",
    category: "Team Culture",
    image: "https://picsum.photos/seed/4/600/400",
    aiHint: "office people",
  },
  {
    title: "Product Hunt Launch",
    category: "Announcement",
    image: "https://picsum.photos/seed/5/600/400",
    aiHint: "space rocket",
    },
  {
    title: "Weekly Newsletter",
    category: "Informative",
    image: "https://picsum.photos/seed/6/600/400",
    aiHint: "reading book",
    },
];

const savedHashtags = [
    { title: 'Tech Startups', tags: ['#startup', '#tech', '#innovation', '#saas', '#ai'] },
    { title: 'AI Marketing', tags: ['#AI', '#Marketing', '#FutureOfTech', '#MarTech'] },
    { title: 'Developer Life', tags: ['#devlife', '#coding', '#software', '#webdev', '#reactjs'] },
    { title: 'Content Creation', tags: ['#content', '#socialmedia', '#digitalmarketing', '#creative'] },
]

const recentVideos = [
    { title: "AI in Marketing", duration: "1:23", image: "https://picsum.photos/seed/11/600/400", aiHint: "abstract technology" },
    { title: "Team Culture Highlights", duration: "2:45", image: "https://picsum.photos/seed/12/600/400", aiHint: "people office" },
    { title: "New Feature Launch", duration: "0:58", image: "https://picsum.photos/seed/13/600/400", aiHint: "product design" },
    { title: "A Day at Trendix", duration: "5:10", image: "https://picsum.photos/seed/14/600/400", aiHint: "modern workspace" },
]


export default function LibraryPage() {
  return (
    <div className="space-y-6">
        <Tabs defaultValue="videos">
            <TabsList>
                <TabsTrigger value="videos">My Videos</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtag Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentVideos.map((video) => (
                        <div key={video.title} className="group relative rounded-lg overflow-hidden">
                             <Link href="/video-generator/editor">
                                <Image 
                                    src={video.image} 
                                    alt={video.title} 
                                    width={600} 
                                    height={400} 
                                    data-ai-hint={video.aiHint}
                                    className="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-3">
                                    <div className="flex justify-end">
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="text-white">
                                        <PlayCircle className="size-10 text-white/80 group-hover:text-white transition-colors cursor-pointer" />
                                        <h4 className="font-semibold mt-2">{video.title}</h4>
                                        <p className="text-xs">{video.duration}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                    <Card key={template.title} className="group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative">
                        <Image
                            src={template.image}
                            alt={template.title}
                            width={600}
                            height={400}
                            data-ai-hint={template.aiHint}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge variant="secondary" className="absolute top-3 left-3">{template.category}</Badge>
                        </div>
                        <div className="p-4 space-y-2">
                        <h3 className="font-semibold">{template.title}</h3>
                        <Button className="w-full" asChild>
                            <Link href="/composer">Use Template</Link>
                        </Button>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </TabsContent>
            <TabsContent value="hashtags" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {savedHashtags.map((group) => (
                        <Card key={group.title}>
                            <CardHeader>
                                <CardTitle>{group.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {group.tags.map(tag => (
                                        <Badge key={tag} variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                                <Button className="w-full mt-4" asChild>
                                    <Link href="/composer">Use Group</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
