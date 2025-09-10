'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Clock, DollarSign } from "lucide-react";

const statsData = [
  {
    metric: "Subscribers",
    icon: Users,
    value: "125K",
    change: "+1.2K",
  },
  {
    metric: "Views (30 days)",
    icon: Eye,
    value: "2.1M",
    change: "+15%",
  },
  {
    metric: "Watch Time (30 days)",
    icon: Clock,
    value: "8.4K hours",
    change: "+12%",
  },
  {
    metric: "Est. Revenue (30 days)",
    icon: DollarSign,
    value: "$4,250",
    change: "+20%",
  },
];

export default function YouTubeStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
            <Card key={stat.metric}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.metric}</CardTitle>
                    <stat.icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change} vs. previous 30 days</p>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
