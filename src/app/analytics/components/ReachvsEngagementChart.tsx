"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
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
  // 12 months
  { date: "2025-11", reach: 124, engagement: 10 },
  { date: "2025-12", reach: 155, engagement: 30 },
  { date: "2025-01", reach: 186, engagement: 44 },
  { date: "2025-02", reach: 305, engagement: 92 },
  { date: "2025-03", reach: 237, engagement: 44 },
  { date: "2025-04", reach: 209, engagement: 35 },
  { date: "2025-05", reach: 229, engagement: 41 },
  { date: "2025-06", reach: 185, engagement: 25 },
  { date: "2025-07", reach: 192, engagement: 28 },
  { date: "2025-08", reach: 214, engagement: 35 },
  { date: "2025-09", reach: 229, engagement: 44 },
  { date: "2025-10", reach: 244, engagement: 56 },
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
    // If mobile, only show last 6 months
    const date = new Date(data.date);

    if (isMobile) {
      const now = new Date();
      const sixMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      );
      return date >= sixMonthsAgo && date <= now;
    }

    return true;
  });

  const currentEngagementToReachRatio = () => {
    const currentData = filteredData[filteredData.length - 1];
    const engagementToReachRatio = currentData.engagement / currentData.reach;
    return engagementToReachRatio;
  }

  const getAverageEngagementToReachRatio = () => {
    const totalReach = filteredData.reduce((total, data) => total + data.reach, 0);
    const totalEngagement = filteredData.reduce((total, data) => total + data.engagement, 0);
    const averageReach = totalReach / filteredData.length;
    const averageEngagement = totalEngagement / filteredData.length;
    return averageEngagement / averageReach;
  };

  const engagementToReachRatioChange = () => {
    const currentRatio = currentEngagementToReachRatio();
    const averageRatio = getAverageEngagementToReachRatio();
    const percentageChange = ((currentRatio - averageRatio) / averageRatio) * 100;
    return percentageChange;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach vs Engagement</CardTitle>
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
              {engagementToReachRatioChange() > 0 ? (
                <>
                  Engagement efficiency up by {engagementToReachRatioChange().toFixed(2)}% this month
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </>
              ) : (
                <>
                  Engagement efficiency down by {Math.abs(engagementToReachRatioChange()).toFixed(2)}% this month
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing reach vs. engagement for the past {isMobile ? "6 months" : "12 months"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
