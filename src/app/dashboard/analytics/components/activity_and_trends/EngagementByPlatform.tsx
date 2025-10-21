"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPlatformEngagement } from "@/app/lib/analyticsClient";

export const description = "A donut chart with text";

const chartConfig = {
  platform: {
    label: "Platform",
  },
  instagram: {
    label: "Instagram",
    color: "var(--chart-1)",
  },
  facebook: {
    label: "Facebook",
    color: "var(--chart-2)",
  },
  discord: {
    label: "Discord",
    color: "var(--chart-3)",
  },
  tiktok: {
    label: "Tiktok",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export default function EngagementByPlatform() {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = React.useState<Array<{platform: string, clicks: number, fill: string}>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlatformEngagement();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching platform engagement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalClicks = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clicks, 0);
  }, [chartData]);

  const topPlatform = () => {
    if (chartData.length === 0) return null;
    const topPlatform = chartData.reduce((acc, curr) => {
      if (curr.clicks > acc.clicks) {
        return curr;
      }
      return acc;
    }, chartData[0]);
    return topPlatform;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Engagement By Platform</CardTitle>
        <CardDescription>
          {isMobile ? "(Tap for more info)" : "(Hover for more info)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="min-h-[225px] max-h-[400px] w-full"
        >
          <PieChart className="">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="clicks"
              nameKey="platform"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClicks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clicks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="platform" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {loading ? (
          <div className="text-muted-foreground">Loading engagement data...</div>
        ) : (
          <>
            <div className="flex items-center gap-2 leading-relaxed font-medium">
              {topPlatform() && (
                <>
                  {topPlatform()!.platform.charAt(0).toUpperCase() +
                    topPlatform()!.platform.slice(1)}{" "}
                  leads with {((topPlatform()!.clicks / totalClicks) * 100).toFixed(2)}% of total engagement
                </>
              )}
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Showing all-time distribution of total engagement clicks by social
              platform
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
