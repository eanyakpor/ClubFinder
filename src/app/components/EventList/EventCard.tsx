import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import React from "react";
import { EventItem } from "@/app/lib/data";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function EventCard({ event }: { event: EventItem }) {
  // ISO date to Day, Mon dd, hh:mm AM/PM
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles", // force PST/PDT for display
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-min hover:brightness-95 cursor-pointer hover:shadow-lg transition-all duration-200">
      <CardTitle className="px-4">
        <h1>{event.club}</h1>
      </CardTitle>
      <CardContent className="px-0">
        <Skeleton className="h-[200px] w-[300px]" />
      </CardContent>
      <CardFooter className="flex flex-1 flex-col justify-between gap-2 items-start">
        <h2>{event.title}</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center  gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 min-h-4 min-w-4" />
            <p>{formatDate(event.start)}</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 min-h-4 min-w-4" />
            <p>{event.location || "N/A"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {event.tags?.slice(0, 3).map((tag) => (
            <Badge
              variant="outline"
              className="px-4 py-2 bg-accent text-accent-foreground"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 bg-accent text-accent-foreground"
              >
                Tag
              </Badge>
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export default EventCard;
