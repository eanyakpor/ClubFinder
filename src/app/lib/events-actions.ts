/*
  Server actions for events data
  
  SECURITY: All database operations happen on the server side
*/

'use server'

import { createClient } from "./supabaseServer"

// Server-only Supabase client for data operations

export async function getUpcomingEvents(clubName?: string) {
  const supabase = await createClient()
  const nowIso = new Date().toISOString()

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", nowIso)
    .order("start_time", { ascending: true })

  if (clubName) {
    query = query.eq("club_name", clubName)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getPastEvents(limit: number = 10, clubName?: string) {
  const supabase = await createClient()
  const nowIso = new Date().toISOString()

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })
    .limit(limit)

  if (clubName) {
    query = query.eq("club_name", clubName)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getTodayEvents(clubName?: string) {
  const supabase = await createClient()
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()

  let query = supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", startOfDay)
    .lt("start_time", endOfDay)
    .order("start_time", { ascending: true })

  if (clubName) {
    query = query.eq("club_name", clubName)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  // If no events today, return mock data
  if (!data || data.length === 0) {
    const mockTime = new Date().toISOString()
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
    ]
  }

  return data
}

export async function getAllEventsData(clubName?: string, pastLimit: number = 10) {
  try {
    const [upcomingEvents, pastEvents, todayEvents] = await Promise.all([
      getUpcomingEvents(clubName),
      getPastEvents(pastLimit, clubName),
      getTodayEvents(clubName),
    ])

    return {
      upcomingEvents,
      pastEvents,
      todayEvents,
    }
  } catch (error) {
    console.error('Error fetching all events data:', error)
    throw error
  }
}
