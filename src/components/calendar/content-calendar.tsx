'use client';

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { addDays, startOfMonth } from 'date-fns';
import { Twitter } from 'lucide-react';

const scheduledPosts = [
  {
    date: addDays(new Date(), 2),
    title: "Launch new feature",
    platform: "Twitter",
  },
  {
    date: addDays(new Date(), 5),
    title: "Weekly tech roundup",
    platform: "Facebook",
  },
  {
    date: addDays(new Date(), 5),
    title: "Behind the scenes",
    platform: "Instagram",
  },
  {
    date: addDays(new Date(), 10),
    title: "AI in 2024 discussion",
    platform: "Twitter",
  },
];

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
                  <Badge key={i} className="whitespace-nowrap w-full justify-start block text-left h-auto py-1">
                    <div className="flex items-center gap-1">
                      <Twitter className="size-3" />
                      <span className="truncate">{post.title}</span>
                    </div>
                  </Badge>
                ))}
              </div>
            </>
          );
        },
      }}
    />
  );
}
