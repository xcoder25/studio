import type { FC, SVGProps } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  platform: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  followers: string;
  change: string;
  changeType?: 'positive' | 'negative';
};

export default function StatsCard({ platform, icon: Icon, followers, change, changeType = 'positive' }: StatsCardProps) {
    const platformColorMap: { [key: string]: string } = {
        Twitter: "bg-sky-500",
        Facebook: "bg-blue-600",
        Instagram: "bg-fuchsia-600",
        TikTok: "bg-black",
      };
  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute top-0 left-0 h-1.5 w-full", platformColorMap[platform])}></div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{platform}</h3>
          <Icon className="size-6 text-muted-foreground" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="size-4" /> Followers</p>
            <p className="text-3xl font-bold">{followers}</p>
          </div>
          <div className={cn(
            "flex items-center text-sm font-semibold",
            changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          )}>
            {changeType === 'positive' ? <TrendingUp className="size-4 mr-1" /> : <TrendingDown className="size-4 mr-1" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
