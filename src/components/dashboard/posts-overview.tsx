import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Twitter, Facebook, Instagram } from "lucide-react"
import Link from 'next/link';

const posts = [
  {
    content: "Excited to launch our new AI feature for post generation! 🚀",
    platform: "Twitter",
    status: "Published",
    date: "2 days ago",
    engagement: "1.2K Likes",
  },
  {
    content: "Deep dive into our latest analytics dashboard updates. 📊",
    platform: "Facebook",
    status: "Published",
    date: "5 days ago",
    engagement: "876 Likes",
  },
  {
    content: "Check out our new content calendar view for easy planning.",
    platform: "Twitter",
    status: "Scheduled",
    date: "in 3 days",
    engagement: "-",
  },
  {
    content: "How to leverage trending hashtags for maximum reach.",
    platform: "Instagram",
    status: "Draft",
    date: "-",
    engagement: "-",
  },
]

const platformIcons = {
  Twitter: <Twitter className="size-4 text-sky-500" />,
  Facebook: <Facebook className="size-4 text-blue-600" />,
  Instagram: <Instagram className="size-4 text-fuchsia-600" />,
}

const statusColors = {
  Published: "bg-green-500/20 text-green-400 border-green-500/30",
  Scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export default function PostsOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Posts Overview</CardTitle>
          <CardDescription>A quick look at your recent and upcoming posts.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
            <Link href="/calendar">
                View Calendar <ArrowRight className="ml-2 size-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="h-72 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Engagement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {platformIcons[post.platform as keyof typeof platformIcons]}
                    <span className="font-medium truncate max-w-xs">{post.content}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[post.status as keyof typeof statusColors]}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{post.date}</TableCell>
                <TableCell className="text-muted-foreground">{post.engagement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
