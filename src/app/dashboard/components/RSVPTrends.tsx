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
  { month: "January", RSVPs: 186 },
  { month: "February", RSVPs: 305 },
  { month: "March", RSVPs: 237 },
  { month: "April", RSVPs: 73 },
  { month: "May", RSVPs: 209 },
  { month: "June", RSVPs: 214 },
]

const chartConfig = {
  RSVPs: {
    label: "RSVPs",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function RSVPTrends() {
  const isMobile = useIsMobile()

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>RSVP Trends</CardTitle>
        <CardDescription>2025</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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

