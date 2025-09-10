
"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"

const chartData = [
  { date: "01/05", views: 2300 },
  { date: "02/05", views: 2450 },
  { date: "03/05", views: 2800 },
  { date: "04/05", views: 2600 },
  { date: "05/05", views: 3100 },
  { date: "06/05", views: 3400 },
  { date: "07/05", views: 3350 },
]

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--destructive))",
  },
}

export default function ViewsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="views"
          type="monotone"
          stroke="var(--color-views)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  )
}
