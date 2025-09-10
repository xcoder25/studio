
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, startOfMonth } from 'date-fns';
import { Twitter, Facebook, Instagram, Edit, Clock, Trash2 } from 'lucide-react';

const scheduledPosts = [
  {
    date: addDays(new Date(), 2),
    title: "Launch new feature",
    content: "We're thrilled to announce our new AI-powered video editor! Create stunning videos from text or images in seconds. #AI #VideoEditing #SaaS",
    platform: "Twitter",
    image: 'https://picsum.photos/seed/cal1/600/400',
    aiHint: 'abstract technology',
  },
  {
    date: addDays(new Date(), 5),
    title: "Weekly tech roundup",
    content: "This week in tech: A look at the latest advancements in generative AI and what it means for content creators. Read our full analysis on the blog.",
    platform: "Facebook",
    image: 'https://picsum.photos/seed/cal2/600/400',
    aiHint: 'futuristic city',
  },
  {
    date: addDays(new Date(), 5),
    title: "Behind the scenes",
    content: "A sneak peek at the team that makes Trendix possible! #TeamCulture #StartupLife",
    platform: "Instagram",
    image: 'https://picsum.photos/seed/cal3/600/400',
    aiHint: 'people office',
  },
  {
    date: addDays(new Date(), 10),
    title: "AI in 2024 discussion",
    content: "What are your predictions for AI in 2024? We think it's going to be all about multimodal models. Join the conversation!",
    platform: "Twitter",
    image: 'https://picsum.photos/seed/cal4/600/400',
    aiHint: 'robot human',
  },
];

const platformIcons = {
    Twitter: <Twitter className="size-4 text-sky-500" />,
    Facebook: <Facebook className="size-4 text-blue-600" />,
    Instagram: <Instagram className="size-4 text-fuchsia-600" />,
}

export default function ContentCalendar() {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  return (
    <Calendar
      mode="single"
      selected={new Date()}
      month={month}
      onMonthChange={setMonth}
      className="content-calendar"
      classNames={{
        day_today: 'bg-accent text-accent-foreground',
        table: 'w-full border-collapse',
        head_row: 'flex border-b',
        head_cell: 'w-full text-muted-foreground text-sm p-2',
        row: 'flex w-full border-b',
        cell: 'w-full h-auto min-h-[120px] p-0 relative',
        day: 'h-full w-full justify-start items-start p-1.5',
      }}
      components={{
        DayContent: ({ date }) => {
          const postsForDay = scheduledPosts.filter(
            p => p.date.toDateString() === date.toDateString()
          );
          return (
            <>
              <time dateTime={date.toISOString()} className="absolute top-1.5 right-1.5 text-xs">
                {date.getDate()}
              </time>
              <div className="space-y-1 mt-6">
                {postsForDay.map((post, i) => (
                  <Popover key={i}>
                    <PopoverTrigger asChild>
                        <Badge
                            variant="outline"
                            className="whitespace-nowrap w-full justify-start block text-left h-auto py-1 cursor-pointer hover:bg-muted"
                        >
                            <div className="flex items-center gap-1">
                            {platformIcons[post.platform as keyof typeof platformIcons]}
                            <span className="truncate">{post.title}</span>
                            </div>
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 font-semibold">
                                 {platformIcons[post.platform as keyof typeof platformIcons]}
                                 {post.platform} Post
                            </div>
                            <Image src={post.image} alt={post.title} width={600} height={400} data-ai-hint={post.aiHint} className="rounded-md" />
                            <p className="text-sm text-muted-foreground">{post.content}</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline"><Edit className="mr-2"/>Edit</Button>
                                <Button size="sm" variant="outline"><Clock className="mr-2"/>Reschedule</Button>
                                <Button size="sm" variant="destructive" ><Trash2 className="mr-2"/>Unschedule</Button>
                            </div>
                        </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </>
          );
        },
      }}
    />
  );
}
