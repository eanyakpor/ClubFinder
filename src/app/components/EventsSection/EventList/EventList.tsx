
"use client";

import EventCard from "./EventCard";
import { toEventItem } from "@/lib/eventsClient";

interface EventGridProps {
  events: any[];
}

export default function EventGrid({ events }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium mb-2">No events found</p>
          <p className="text-sm">Check back later for upcoming events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-8 ${
      events.length === 1 
        ? 'grid-cols-1' 
        : events.length === 2 
        ? 'grid-cols-1 lg:grid-cols-2' 
        : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
    }`}>
      {events
        .map((event) => toEventItem(event))
        .map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
    </div>
  );
}
