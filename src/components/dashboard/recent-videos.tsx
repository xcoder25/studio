import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, MoreHorizontal } from "lucide-react";
import { type RecentVideoData } from "@/ai/flows/generate-dashboard-data";


export default function RecentVideos({ videos }: { videos: RecentVideoData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Videos</CardTitle>
                <CardDescription>Your latest generated video content.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <div key={video.title} className="group relative rounded-lg overflow-hidden">
                            <Image 
                                src={video.image} 
                                alt={video.title} 
                                width={600} 
                                height={400} 
                                data-ai-hint={video.aiHint}
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" 
                                loading="lazy"
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
            </CardContent>
        </Card>
    );
}
