"use client";

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

const chartData = [
  { Date: "2024-11", Event: "Coding Competition", Rsvps: 100, Attendance: 70, Engagement: 190 },
  { Date: "2024-12", Event: "Job Fair", Rsvps: 124, Attendance: 95, Engagement: 280 },
  { Date: "2025-01", Event: "Startup Pitch Competition", Rsvps: 120, Attendance: 95, Engagement: 280 },
  { Date: "2025-02", Event: "Cybersecurity Competition", Rsvps: 150, Attendance: 120, Engagement: 280 },
  { Date: "2025-02", Event: "Blockchain Workshop", Rsvps: 90, Attendance: 60, Engagement: 150 },
  { Date: "2025-03", Event: "Data Science Meetup", Rsvps: 180, Attendance: 150, Engagement: 400 },
  { Date: "2025-04", Event: "Leetcode Workshop", Rsvps: 289, Attendance: 220, Engagement: 600 },
  { Date: "2025-04", Event: "Mock Interview", Rsvps: 80, Attendance: 50, Engagement: 150 },
  { Date: "2025-05", Event: "Mental Health Fair", Rsvps: 100, Attendance: 70, Engagement: 190 },
  { Date: "2025-05", Event: "Women in Tech Panel", Rsvps: 140, Attendance: 110, Engagement: 250 },
  { Date: "2025-06", Event: "AI Workshop", Rsvps: 210, Attendance: 180, Engagement: 350 },
  { Date: "2025-07", Event: "Resume Workshop", Rsvps: 172, Attendance: 140, Engagement: 250 },
  { Date: "2025-08", Event: "Networking Event", Rsvps: 100, Attendance: 70, Engagement: 190 },
  { Date: "2025-09", Event: "Cultural Night", Rsvps: 150, Attendance: 130, Engagement: 310 },
  { Date: "2025-09", Event: "Homecoming Mixer", Rsvps: 180, Attendance: 150, Engagement: 400 },
  { Date: "2025-10", Event: "Welcome Week", Rsvps: 120, Attendance: 95, Engagement: 280 },
];


const chartConfig = {
  Attendance: {
    label: "Attendance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function EventPerformance() {
  const isMobile = useIsMobile();

  const topEvent = chartData.reduce((prev, current) => {
    return prev.Attendance > current.Attendance ? prev : current;
  });

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
              label={{ value: 'Event' }}
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
        <div className="flex gap-2 leading-relaxed font-medium">
          <div className="flex items-center gap-2 leading-relaxed font-medium">
            {topEvent.Event} had the highest attendance with {topEvent.Attendance} attendees
          </div>
        </div>
        <div className="text-muted-foreground leading-relaxed">
          Showing total RSVPs for the last {isMobile ? "6 months" : "12 months"}
        </div>
      </CardFooter>
    </Card>
  );
}
