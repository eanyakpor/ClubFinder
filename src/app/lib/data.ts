import { IS_PREVIEW } from "./config";
import { getSupabaseClient } from "./supabase";
import events from "@/mocks/events.json";

export type EventItem = {
  id: string;
  club: string;
  title: string;
  start: string;      // ISO
  location: string;
  tags: string[];
};

export async function listEvents(): Promise<EventItem[]> {
    if (IS_PREVIEW) {
        return events; // Mock data from local JSON file
      }

  // Real path (example Supabase table "events")
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, club, title, start, location, tags")
    .order("start", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return (data ?? []) as EventItem[];
}