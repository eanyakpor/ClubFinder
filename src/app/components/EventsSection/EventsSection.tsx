"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodayEventsCard from "./TodayEventsCard";
import EventGrid from "./EventList/EventList";

interface EventsSectionProps {
  upcoming: any[];
  past: any[];
  today: any[];
}

export default function EventsSection({
  upcoming,
  past,
  today,
}: EventsSectionProps) {
  return (
    <div className="flex justify-center px-20 gap-8">
      <div className="">
        <Tabs
          defaultValue="upcoming"
          className="flex flex-col items-center xl:items-start justify-center gap-0"
        >
          {/* Today's Events (Mobile) */}
          <TodayEventsCard today={today} isMobile={true} />

          {/* Tabs */}
          <div className="flex-col justify-center items-center xl:justify-start">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming" className="cursor-pointer">
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="past" className="cursor-pointer">
                Past Events
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8">
            {/* Event List */}
            <TabsContent value="upcoming">
              <EventGrid events={upcoming} />
            </TabsContent>

            <TabsContent value="past">
              <EventGrid events={past} />
            </TabsContent>

            {/* Today's Events (Desktop) */}
            <TodayEventsCard today={today} isMobile={false} />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
