"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple line chart";

const chartData = [
  // Mock Data (6 months)
  { month: "January", reach: 1502, engagement: 141 },
  { month: "February", reach: 1788, engagement: 183 },
  { month: "March", reach: 1827, engagement: 203 },
  { month: "April", reach: 1956, engagement: 235 },
  { month: "May", reach: 2085, engagement: 269 },
  { month: "June", reach: 2214, engagement: 301 },
];

const chartConfig = {
  reach: {
    label: "Reach",
    color: "var(--chart-1)",
  },
  engagement: {
    label: "Engagement",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function ReachvsEngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach vs Engagement</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="" />}  />
            <Area
              dataKey="reach"
              type="monotone"
              stroke="var(--color-reach)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="engagement"
              type="monotone"
              stroke="var(--color-engagement)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Compare impressions vs. engagement to spot successful content.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
