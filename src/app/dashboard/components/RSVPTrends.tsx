"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useIsMobile } from "@/hooks/use-mobile"

const chartData = [
  // 12 months
  { date: "2025-01-01", RSVPs: 186 },
  { date: "2025-02-01", RSVPs: 305 },
  { date: "2025-03-01", RSVPs: 237 },
  { date: "2025-04-01", RSVPs: 73 },
  { date: "2025-05-01", RSVPs: 209 },
  { date: "2025-06-01", RSVPs: 214 },
  { date: "2025-07-01", RSVPs: 229 },
  { date: "2025-08-01", RSVPs: 244 },
  { date: "2025-09-01", RSVPs: 259 },
  { date: "2025-10-01", RSVPs: 274 },
  { date: "2025-11-01", RSVPs: 289 },
  { date: "2025-12-01", RSVPs: 304 },
]

const chartConfig = {
  RSVPs: {
    label: "RSVPs",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function RSVPTrends() {
  const isMobile = useIsMobile()

  const filteredData = chartData.filter((data) => {
    // If mobile, only show prior 6 months
    const date = new Date(data.date);

    if (isMobile) {
      return date >= new Date("2025-01-01") && date <= new Date("2025-06-01");
    }

    return true;
  });

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>RSVP Trends</CardTitle>
        <CardDescription>2025</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value + 'T00:00:00');
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="RSVPs" fill="var(--color-chart-1)" className="hover:fill-[var(--color-chart-2)] transition-all duration-300 ease-in-out" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total RSVPs for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default RSVPTrends

