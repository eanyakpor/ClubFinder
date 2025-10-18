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
import { getReachVsEngagement } from "@/app/lib/analyticsClient";

export const description = "A multiple line chart";

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

export default function ReachvsEngagement() {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = React.useState<Array<{date: string, reach: number, engagement: number}>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReachVsEngagement();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching reach vs engagement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    return chartData.filter((data) => {
      // If mobile, only show last 6 months
      const date = new Date(data.date + '-01');

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
  }, [chartData, isMobile]);

  const currentEngagementToReachRatio = () => {
    if (filteredData.length === 0) return 0;
    const currentData = filteredData[filteredData.length - 1];
    return currentData.engagement / currentData.reach;
  }

  const getAverageEngagementToReachRatio = () => {
    if (filteredData.length === 0) return 0;
    const totalReach = filteredData.reduce((total, data) => total + data.reach, 0);
    const totalEngagement = filteredData.reduce((total, data) => total + data.engagement, 0);
    const averageReach = totalReach / filteredData.length;
    const averageEngagement = totalEngagement / filteredData.length;
    return averageEngagement / averageReach;
  };

  const engagementToReachRatioChange = () => {
    const currentRatio = currentEngagementToReachRatio();
    const averageRatio = getAverageEngagementToReachRatio();
    if (averageRatio === 0) return 0;
    const percentageChange = ((currentRatio - averageRatio) / averageRatio) * 100;
    return percentageChange;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reach vs. Engagement</CardTitle>
        <CardDescription>
          {isMobile ? "(Tap for more info)" : "(Hover for more info)"}
        </CardDescription>
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
            <div className="flex items-center gap-2 leading-relaxed font-medium">
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
            <div className="text-muted-foreground flex items-center gap-2 leading-relaxed">
              Showing reach vs. engagement for the past {isMobile ? "6 months" : "12 months"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
