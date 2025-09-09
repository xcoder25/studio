
'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayCircle, MoreHorizontal } from "lucide-react";

const templates = [
  {
    title: "New Feature Announcement",
    category: "Announcement",
    image: "https://picsum.photos/600/400?random=1",
    aiHint: "technology abstract",
  },
  {
    title: "Tech Insight Infographic",
    category: "Informative",
    image: "https://picsum.photos/600/400?random=2",
    aiHint: "data visualization",
  },
  {
    title: "Quote of the Day",
    category: "Inspirational",
    image: "https://picsum.photos/600/400?random=3",
    aiHint: "nature landscape",
  },
  {
    title: "Behind the Scenes",
    category: "Team Culture",
    image: "https://picsum.photos/600/400?random=4",
    aiHint: "office people",
  },
];

const savedHashtags = [
    { title: 'Tech Startups', tags: ['#startup', '#tech', '#innovation'] },
    { title: 'AI Marketing', tags: ['#AI', '#Marketing', '#FutureOfTech'] },
    { title: 'Developer Life', tags: ['#devlife', '#coding', '#software'] },
]

const recentVideos = [
    { title: "AI in Marketing", duration: "1:23", image: "https://picsum.photos/600/400?random=11", aiHint: "abstract technology" },
    { title: "Team Culture Highlights", duration: "2:45", image: "https://picsum.photos/600/400?random=12", aiHint: "people office" },
    { title: "New Feature Launch", duration: "0:58", image: "https://picsum.photos/600/400?random=13", aiHint: "product design" },
    { title: "A Day at Trendix", duration: "5:10", image: "https://picsum.photos/600/400?random=14", aiHint: "modern workspace" },
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
                        </div>
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <h3 className="font-semibold text-lg">{template.title}</h3>
                        <Button className="w-full">Use Template</Button>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </TabsContent>
            <TabsContent value="hashtags" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <Button className="w-full mt-4">Use Group</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
