"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toEventItem } from "@/lib/eventsClient";

interface TodayEventsCardProps {
  today: any[];
  isMobile?: boolean;
}

export default function TodayEventsCard({ today, isMobile = false }: TodayEventsCardProps) {
  const mobileClasses = "xl:hidden w-[350px] md:w-md xl:w-xl h-min mb-4";
  const desktopClasses = "xl:flex xl:flex-col hidden w-sm h-min gap-4";
  
  return (
    <Card className={isMobile ? mobileClasses : desktopClasses}>
      <CardTitle className="px-6">
        <h1>Events Today</h1>
      </CardTitle>
      <CardContent className="flex flex-col gap-4">
        {today
          .map((event) => toEventItem(event))
          .map((event) => (
            <Card 
              key={'event' + event.id} 
              className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200"
            >
              <CardTitle className="px-6">{event.club}</CardTitle>
              <CardContent className="px-6 text-muted-foreground">
                {event.title}
              </CardContent>
            </Card>
          ))}
      </CardContent>
    </Card>
  );
}
