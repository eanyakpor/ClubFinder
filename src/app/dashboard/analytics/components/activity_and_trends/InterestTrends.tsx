"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

import { useIsMobile } from "@/hooks/use-mobile";
import { getMonthlyRSVPs } from "@/app/lib/analyticsClient";

const chartConfig = {
  RSVPs: {
    label: "RSVPs",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function InterestTrends() {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = React.useState<Array<{date: string, RSVPs: number}>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyRSVPs();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching monthly RSVPs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentMonth = chartData[chartData.length - 1];

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

  const compareToAverage = () => {
    if (filteredData.length === 0 || !currentMonth) return 0;
    const totalRSVPs = filteredData.reduce(
      (total, data) => total + data.RSVPs,
      0
    );
    const averageRSVPs = totalRSVPs / filteredData.length;
    const percentageChange =
      ((currentMonth.RSVPs - averageRSVPs) / averageRSVPs) * 100;
    return percentageChange;
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Interest Trends</CardTitle>
        <CardDescription>
          {isMobile ? "(Tap for more info)" : "(Hover for more info)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <LineChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value + "T00:00:00");
                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => new Date(value + "T00:00:00").toLocaleDateString("en-US", { month: "long" })} />}
            />
            <Line
              type="monotone"
              dataKey="RSVPs"
              stroke="var(--color-RSVPs)"
              strokeWidth={2}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          <div className="flex items-center gap-2 leading-relaxed font-medium">
            {compareToAverage() > 0 ? (
              <>
                This month has {compareToAverage().toFixed(2)}% higher RSVP activity than your
                recent average
                <TrendingUp className="h-4 w-4 text-green-600" />
              </>
            ) : (
              <>
                This month has {Math.abs(compareToAverage()).toFixed(2)}% lower RSVP activity
                than your recent average
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
        </div>
        <div className="text-muted-foreground leading-relaxed">
          Showing total monthly RSVPs for the last {isMobile ? "6 months" : "12 months"}
        </div>
      </CardFooter>
    </Card>
  );
}

