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
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "A multiple line chart";

const chartData = [
  // Mock Data (12 months)
  { date: "2025-01", reach: 1502, engagement: 141 },
  { date: "2025-02", reach: 1788, engagement: 183 },
  { date: "2025-03", reach: 1827, engagement: 203 },
  { date: "2025-04", reach: 1956, engagement: 235 },
  { date: "2025-05", reach: 2085, engagement: 269 },
  { date: "2025-06", reach: 2214, engagement: 301 },
  { date: "2025-07", reach: 2343, engagement: 335 },
  { date: "2025-08", reach: 2472, engagement: 367 },
  { date: "2025-09", reach: 2601, engagement: 409 },
  { date: "2025-10", reach: 2730, engagement: 441 },
  { date: "2025-11", reach: 2859, engagement: 473 },
  { date: "2025-12", reach: 2988, engagement: 505 },
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
  const isMobile = useIsMobile();

  const filteredData = chartData.filter((data) => {
    // If mobile, only show prior 6 months
    const date = new Date(data.date);

    if (isMobile) {
      return date >= new Date("2025-01") && date <= new Date("2025-06");
    }

    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach vs Engagement</CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Add 'T00:00:00' to ensure local timezone handling
                const date = new Date(value + 'T00:00:00');
                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => {
                const date = new Date(value + 'T00:00:00');
                return date.toLocaleDateString("en-US", {
                  month: "long",
                });
              }} />}
            />
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
