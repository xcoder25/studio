import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, Clock, Percent } from "lucide-react";

const videoStatsData = [
  {
    metric: "Total Video Views",
    icon: Eye,
    value: "1.8M",
    change: "+15%",
  },
  {
    metric: "Avg. Watch Time",
    icon: Clock,
    value: "2m 15s",
    change: "+8%",
  },
  {
    metric: "Completion Rate",
    icon: Percent,
    value: "68%",
    change: "-2%",
    changeType: "negative",
  },
];

export default function VideoStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Performance</CardTitle>
        <CardDescription>Key metrics for your generated videos this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {videoStatsData.map((stat) => (
                <div key={stat.metric} className="p-4 rounded-lg bg-background/50">
                    <stat.icon className="size-8 mx-auto text-primary" />
                    <p className="mt-4 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.metric}</p>
                    <p className={`mt-1 text-xs font-medium ${stat.changeType === "negative" ? "text-red-500" : "text-green-500"}`}>
                        {stat.change}
                    </p>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
