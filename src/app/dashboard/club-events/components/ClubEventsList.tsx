"use client"
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ClubEventCard from "./ClubEventCard";
import { toEventItem } from "@/lib/eventsClient";

interface ClubEventsListProps {
  upcoming: any[];
  past: any[];
  today: any[];
  onEventUpdated?: () => void;
}

function ClubEventsList({upcoming, past, today, onEventUpdated}: ClubEventsListProps) {
  return (
    <div className="flex justify-center px-20 gap-8">
      <div className="">
        <Tabs
          defaultValue="upcoming"
          className="flex flex-col items-center xl:items-start justify-center gap-0"
        >
          {/* Today's Events (Mobile) */}
          <Card className=" xl:hidden w-[350px] md:w-md xl:w-xl h-min mb-4">
            <CardTitle className="px-6">
              <h1>Events Today</h1>
            </CardTitle>
            <CardContent className="flex flex-col gap-4">
              {today.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No events scheduled for today</p>
                </div>
              ) : (
                today
                  .map((event) => toEventItem(event))
                  .map((event) => (
                    <Card
                      key={event.id}
                      className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200"
                    >
                      <CardTitle className="px-6">{event.club}</CardTitle>
                      <CardContent className="px-6 text-muted-foreground">
                        {event.title}
                      </CardContent>
                    </Card>
                  ))
              )}
            </CardContent>
          </Card>
          {/* Tabs */}
          <div className="flex-col justify-center items-center xl:justify-start">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming" className="cursor-pointer ">
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="past" className="cursor-pointer ">
                Past Events
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8">
            {/* Event List */}
            <TabsContent value="upcoming">
              {upcoming.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No upcoming events</p>
                    <p className="text-sm">Create your first event to get started!</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid gap-8 ${
                    upcoming.length === 1 
                      ? 'grid-cols-1' 
                      : upcoming.length === 2 
                      ? 'grid-cols-1 lg:grid-cols-2' 
                      : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
                  }`}
                >
                  {upcoming
                    .map((event) => {
                      const eventItem = toEventItem(event);
                      return { ...eventItem, status: event.status };
                    })
                    .map((event) => (
                      <ClubEventCard key={event.id} event={event} onEventUpdated={onEventUpdated} />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="past">
              {past.length === 0 ? (
                <div className="flex items-center justify-center p-8 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-medium mb-2">No past events</p>
                    <p className="text-sm">Your completed events will appear here</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`grid gap-8 ${
                    past.length === 1 
                      ? 'grid-cols-1' 
                      : past.length === 2 
                      ? 'grid-cols-1 lg:grid-cols-2' 
                      : 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
                  }`}
                >
                  {past
                    .map((event) => {
                      const eventItem = toEventItem(event);
                      return { ...eventItem, status: event.status };
                    })
                    .map((event) => (
                      <ClubEventCard key={event.id} event={event} onEventUpdated={onEventUpdated} />
                    ))}
                </div>
              )}
            </TabsContent>
            {/* Today's Events (Desktop) */}
            <Card className="xl:flex xl:flex-col hidden w-sm h-min gap-4">
              <CardTitle className="px-6">
                <h1>Events Today</h1>
              </CardTitle>
              <CardContent className="flex flex-col gap-4">
                {today.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No events scheduled for today</p>
                  </div>
                ) : (
                  today
                    .map((event) => toEventItem(event))
                    .map((event) => (
                      <Card
                        key={event.id}
                        className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200"
                      >
                        <CardTitle className="px-6">{event.club}</CardTitle>
                        <CardContent className="px-6 text-muted-foreground">
                          {event.title}
                        </CardContent>
                      </Card>
                    ))
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ClubEventsList;
