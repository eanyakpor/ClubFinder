/**
 * Format ISO date string to human-readable format in PST/PDT
 */
"use client";
import { EventItem } from "@/app/lib/data";

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