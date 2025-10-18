"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { getEventPerformance } from "@/app/lib/analyticsClient";


const chartConfig = {
  Attendance: {
    label: "Attendance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function EventPerformance() {
  const isMobile = useIsMobile();
  const [chartData, setChartData] = React.useState<Array<{Date: string, Event: string, Rsvps: number, Attendance: number, Engagement: number}>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEventPerformance();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching event performance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topEvent = React.useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((prev, current) => {
      return prev.Attendance > current.Attendance ? prev : current;
    });
  }, [chartData]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Event Performance</CardTitle>
        <CardDescription>
          {isMobile ? "(Tap for more info)" : "(Hover for more info)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Event"
              tick={false}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              label={{ value: 'Events' }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  
                />
              }
            />
            <Bar
              dataKey="Attendance"
              fill="var(--color-chart-1)"
              className="hover:fill-[var(--color-chart-2)]"
              radius={2}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {loading ? (
          <div className="text-muted-foreground">Loading event data...</div>
        ) : (
          <>
            <div className="flex gap-2 leading-relaxed font-medium">
              <div className="flex items-center gap-2 leading-relaxed font-medium">
                {topEvent && (
                  <>
                    {topEvent.Event} had the highest attendance with {topEvent.Attendance} attendees
                  </>
                )}
              </div>
              
            </div>
            <div className="text-muted-foreground leading-relaxed">
              Showing total RSVPs for the last {isMobile ? "6 months" : "12 months"}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
