"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { EventItem } from "../lib/data";
import EventCard from "./EventsSection/EventList/EventCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchViewProps {
  upcoming_full: any[];
  past_full: any[];
}

function SearchView({ upcoming_full, past_full }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const toEventItem = (event: any): EventItem => {
    return {
      id: event.id,
      title: event.title,
      club: event.club_name,
      start: event.start_time,
      location: event.location,
      tags: event.tags,
    };
  };

  // Filter events based on search query
  const filteredUpcoming = useMemo(() => {
    if (!searchQuery.trim()) return upcoming_full;
    
    const query = searchQuery.toLowerCase();
    return upcoming_full.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.club_name?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  }, [upcoming_full, searchQuery]);

  const filteredPast = useMemo(() => {
    if (!searchQuery.trim()) return past_full;
    
    const query = searchQuery.toLowerCase();
    return past_full.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.club_name?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  }, [past_full, searchQuery]);

  // Get today's events
  const today = useMemo(() => {
    const nowIso = new Date().toISOString();
    return upcoming_full.filter(event => {
      const eventDate = new Date(event.start_time);
      const todayDate = new Date();
      return eventDate.toDateString() === todayDate.toDateString();
    });
  }, [upcoming_full]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex justify-center px-20 gap-8">
      <div className="">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col items-center xl:items-start justify-center gap-0"
        >
          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-6">
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-full shadow-md">
                <Search className="text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search events, clubs, or locations..."
                  className="flex-1 outline-none placeholder:text-neutral-500 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 hover:bg-accent rounded-full transition-colors"
                  >
                    <X className="text-muted-foreground" size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Today's Events (Mobile) */}
          <Card className="xl:hidden w-[350px] md:w-md xl:w-xl h-min mb-4">
            <CardTitle className="px-6">
              <h1>Events Today</h1>
            </CardTitle>
            <CardContent className="flex flex-col gap-4">
              {today
                .map((event) => toEventItem(event))
                .map((event) => (
                  <Card key={event.id} className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200">
                    <CardTitle className="px-6">{event.club}</CardTitle>
                    <CardContent className="px-6 text-muted-foreground">
                      {event.title}
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex-col justify-center items-center xl:justify-start">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming" className="cursor-pointer">
                Upcoming Events {searchQuery && `(${filteredUpcoming.length})`}
              </TabsTrigger>
              <TabsTrigger value="past" className="cursor-pointer">
                Past Events {searchQuery && `(${filteredPast.length})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8">
            {/* Event List */}
            <TabsContent value="upcoming">
              <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8`}>
                {filteredUpcoming.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchQuery ? "No upcoming events match your search." : "No upcoming events found."}
                  </div>
                ) : (
                  filteredUpcoming
                    .map((event) => toEventItem(event))
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8`}>
                {filteredPast.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchQuery ? "No past events match your search." : "No past events found."}
                  </div>
                ) : (
                  filteredPast
                    .map((event) => toEventItem(event))
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                )}
              </div>
            </TabsContent>

            {/* Today's Events (Desktop) */}
            <Card className="xl:flex xl:flex-col hidden w-sm h-min gap-4">
              <CardTitle className="px-6">
                <h1>Events Today</h1>
              </CardTitle>
              <CardContent className="flex flex-col gap-4">
                {today
                  .map((event) => toEventItem(event))
                  .map((event) => (
                    <Card key={event.id} className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200">
                      <CardTitle className="px-6">{event.club}</CardTitle>
                      <CardContent className="px-6 text-muted-foreground">
                        {event.title}
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default SearchView;
