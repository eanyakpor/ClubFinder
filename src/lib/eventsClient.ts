import { getSupabaseClient } from "../app/lib/supabase";
import { EventItem } from "../app/lib/data";

/**
 * Format ISO date string to human-readable format in PST/PDT
 */
export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles", // force PST/PDT for display
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Convert database event object to EventItem format
 */
export function toEventItem(event: any): EventItem {
  return {
    id: event.id,
    title: event.title,
    club: event.club_name,
    start: event.start_time,
    location: event.location,
    tags: event.tags,
  };
}

/**
 * Fetch upcoming events from the database
 * @param clubName - Optional club name to filter by
 */
export async function getUpcomingEvents(clubName?: string) {
  const supabase = getSupabaseClient();
  const nowIso = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", nowIso)
    .order("start_time", { ascending: true });

  if (clubName) {
    query = query.eq("club_name", clubName);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch past events from the database
 * @param limit - Maximum number of events to return (default: 10)
 * @param clubName - Optional club name to filter by
 */
export async function getPastEvents(limit: number = 10, clubName?: string) {
  const supabase = getSupabaseClient();
  const nowIso = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })
    .limit(limit);

  if (clubName) {
    query = query.eq("club_name", clubName);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Fetch today's events from the database
 * @param clubName - Optional club name to filter by
 */
export async function getTodayEvents(clubName?: string) {
  const supabase = getSupabaseClient();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", startOfDay)
    .lt("start_time", endOfDay)
    .order("start_time", { ascending: true });

  if (clubName) {
    query = query.eq("club_name", clubName);
  }

  const { data, error } = await query;

  // console.log("data", data);

  if (error) {
    throw new Error(error.message);
  }

  // If no events today, return mock data
  if (!data || data.length === 0) {
    const mockTime = new Date().toISOString();
    return [
      {
        id: "mock-1",
        title: "NextGen Hacks",
        club_name: "Society of Software Engineers",
        start_time: mockTime,
        location: "California State University, Northridge",
        description: "Description 1",
      },
      {
        id: "mock-2",
        title: "NextGen Hacks",
        club_name: "Society of Software Engineers",
        start_time: mockTime,
        location: "California State University, Northridge",
        description: "Description 1",
      },
      {
        id: "mock-3",
        title: "NextGen Hacks",
        club_name: "Society of Software Engineers",
        start_time: mockTime,
        location: "California State University, Northridge",
        description: "Description 1",
      },
    ];
  }

  return data;
}

/**
 * Fetch all events data needed for event pages
 * @param clubName - Optional club name to filter by
 * @param pastLimit - Maximum number of past events to return (default: 10)
 */
export async function getAllEventsData(clubName?: string, pastLimit: number = 10) {
  try {
    const [upcoming, past, today] = await Promise.all([
      getUpcomingEvents(clubName),
      getPastEvents(pastLimit, clubName),
      getTodayEvents(clubName),
    ]);

    return {
      upcoming,
      past,
      today,
      error: null,
    };
  } catch (error) {
    return {
      upcoming: [],
      past: [],
      today: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
