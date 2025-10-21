// src/lib/data.ts
import { getSupabaseClient } from "./supabaseServer";

export type EventItem = {
  id: string;
  club: string; // maps from club_name
  title: string;
  start: string; // maps from start_time (ISO)
  location: string | null;
  tags: string[] | null;
};

export async function listEvents(): Promise<EventItem[]> {
  const supabase = getSupabaseClient();

  // Alias DB columns → expected UI shape
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      club:club_name,
      start:start_time,
      location,
      tags
    `
    )
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  // TS-safe defaults (if your schema allows nulls)
  return (data ?? []).map((r: any) => ({
    id: r.id ?? "",
    title: r.title ?? "",
    club: r.club ?? "",
    start: r.start ?? "",
    location: r.location ?? null,
    tags: r.tags ?? null,
  }));
}
