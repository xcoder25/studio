
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BarChart, Radio } from "lucide-react";
import YouTubeStats from "@/components/youtube/youtube-stats";
import RecentVideosYT from "@/components/youtube/recent-videos-yt";
import ViewsChart from "@/components/youtube/views-chart";
import ContentIdeas from "@/components/youtube/content-ideas";
import Link from "next/link";

export default function YouTubeStudioPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">YouTube Studio</h1>
                    <p className="text-muted-foreground">Manage your YouTube channel performance and content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><BarChart className="mr-2"/> Channel Analytics</Button>
                    <Button variant="secondary" asChild>
                        <Link href="/youtube-studio/go-live">
                            <Radio className="mr-2" /> Go Live
                        </Link>
                    </Button>
                    <Button><Upload className="mr-2"/> Upload Video</Button>
                </div>
            </div>

            <YouTubeStats />
            
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Views (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ViewsChart />
                    </CardContent>
                </Card>
                <div className="lg:col-span-1">
                    <ContentIdeas />
                </div>
            </div>

            <RecentVideosYT />
        </div>
    );
}

    