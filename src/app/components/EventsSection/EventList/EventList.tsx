import EventCard from "./EventCard";
import { toEventItem } from "@/lib/eventsClient";

interface EventGridProps {
  events: any[];
}

export default function EventGrid({ events }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
      {events
        .map((event) => toEventItem(event))
        .map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
    </div>
  );
}
