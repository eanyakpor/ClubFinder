/*
  This is the main landing page, showing upcoming and past events.
*/

"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import HomeHero from "./components/HomeHero";
import EventsSection from "./components/EventsSection/EventsSection";
import Footer from "./components/Footer/Footer";
import SearchView from "./components/SearchView";
import { getAllEventsData } from "../lib/eventsServer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  const [eventsData, setEventsData] = useState<{
    upcoming: any[];
    past: any[];
    today: any[];
    error: string | null;
  }>({
    upcoming: [],
    past: [],
    today: [],
    error: null
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEventsData();
        setEventsData(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEventsData({
          upcoming: [],
          past: [],
          today: [],
          error: "Failed to load events"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  const filteredUpcoming = useMemo(() => {
    if (!searchQuery.trim()) return eventsData.upcoming;
    
    const query = searchQuery.toLowerCase();
    return eventsData.upcoming.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.club_name?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  }, [eventsData.upcoming, searchQuery]);

  const filteredPast = useMemo(() => {
    if (!searchQuery.trim()) return eventsData.past;
    
    const query = searchQuery.toLowerCase();
    return eventsData.past.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.club_name?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  }, [eventsData.past, searchQuery]);

  const filteredToday = useMemo(() => {
    if (!searchQuery.trim()) return eventsData.today;
    
    const query = searchQuery.toLowerCase();
    return eventsData.today.filter(event => 
      event.title?.toLowerCase().includes(query) ||
      event.club_name?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
  }, [eventsData.today, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="">
        <HomeHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <EventsSection 
          upcoming={filteredUpcoming} 
          past={filteredPast} 
          today={filteredToday} 
        />
        {/* <SearchView upcoming_full={eventsData.upcoming} past_full={eventsData.past} /> */}
      </main>
    </ProtectedRoute>
  );
}
