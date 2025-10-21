"use server";
import { createClient } from "@/utils/supabase/server";
import { EventItem } from "../app/lib/data";



/**
 * Fetch upcoming events from the database
 * @param clubName - Optional club name to filter by
 */
export async function getUpcomingEvents(clubName?: string) {
  const supabase = await createClient();
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
 * @param clubName - Optional club name to filter by
 */
export async function getPastEvents(clubName?: string) {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })

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
  const supabase = await createClient();
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  ).toISOString();

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
 */
export async function getAllEventsData(
  clubName?: string
) {
  try {
    const [upcoming, past, today] = await Promise.all([
      getUpcomingEvents(clubName),
      getPastEvents(clubName),
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
