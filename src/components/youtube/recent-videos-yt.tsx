
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

const videos = [
  {
    title: "Our New AI is a Game-Changer",
    thumbnail: "https://picsum.photos/1280/720?random=21",
    aiHint: "technology abstract",
    views: "1.2M",
    comments: "5,432",
    likes: "98K",
    published: "2 days ago",
  },
  {
    title: "A Day in the Life of a Trendix Dev",
    thumbnail: "https://picsum.photos/1280/720?random=22",
    aiHint: "developer coding",
    views: "450K",
    comments: "1,200",
    likes: "23K",
    published: "1 week ago",
  },
  {
    title: "YouTube Shorts Strategy for 2024",
    thumbnail: "https://picsum.photos/1280/720?random=23",
    aiHint: "social media analytics",
    views: "890K",
    comments: "3,800",
    likes: "65K",
    published: "2 weeks ago",
  },
   {
    title: "How We Built Our AI Video Generator",
    thumbnail: "https://picsum.photos/1280/720?random=24",
    aiHint: "AI robot",
    views: "675K",
    comments: "2,100",
    likes: "45K",
    published: "3 weeks ago",
  },
]


export default function RecentVideosYT() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Videos</CardTitle>
        <CardDescription>A look at your latest content performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Likes</TableHead>
               <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image 
                        src={video.thumbnail} 
                        alt={video.title} 
                        width={120} 
                        height={68} 
                        data-ai-hint={video.aiHint}
                        className="rounded-md object-cover aspect-video"
                    />
                    <span className="font-medium truncate max-w-xs">{video.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{video.views}</TableCell>
                <TableCell className="text-muted-foreground">{video.comments}</TableCell>
                <TableCell className="text-muted-foreground">{video.likes}</TableCell>
                <TableCell className="text-muted-foreground">{video.published}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
