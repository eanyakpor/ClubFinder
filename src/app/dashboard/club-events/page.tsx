"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ClubEventsList from "./components/ClubEventsList";
import { getClubOwnerEventsData } from "@/lib/eventsServer";
import { useAuth } from "../../components/AuthProvider";

export default function ClubEventsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [eventsData, setEventsData] = useState<{
    upcoming: any[];
    past: any[];
    today: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!user || authLoading) return;
    
    try {
      const data = await getClubOwnerEventsData(user.id);
      setEventsData(data);
    } catch (error) {
      console.error("Failed to fetch club events:", error);
      setEventsData({ upcoming: [], past: [], today: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, authLoading]);

  const handleEventUpdated = () => {
    // Refresh events data when an event is updated
    console.log("Event updated, refreshing events list...");
    setLoading(true); // Show loading state while refreshing
    fetchEvents();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading club events...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Please log in to view your club events</span>
      </div>
    );
  }

  if (!eventsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Failed to load events</span>
      </div>
    );
  }
  
  return (
    <ClubEventsList 
      upcoming={eventsData.upcoming} 
      past={eventsData.past} 
      today={eventsData.today}
      onEventUpdated={handleEventUpdated}
    />
  );
}
