// src/app/page.tsx
export const revalidate = 0; // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import { supabaseBrowser } from "./lib/supabase";
import PreviewBanner from "./components/PreviewBanner";
import Hero from "./components/Hero/Hero";
import EventCard from "./components/EventList/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventItem } from "./lib/data";

function fmtDate(iso: string) {
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

export default async function Home() {
  const sb = supabaseBrowser();
  const nowIso = new Date().toISOString(); // compare in UTC (DB stores UTC)
  const userType = "club";

  const { data: upcoming, error: errUpcoming } = await sb
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", nowIso)
    .order("start_time", { ascending: true });

  const { data: past, error: errPast } = await sb
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })
    .limit(10);

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

  if (errUpcoming || errPast) {
    return (
      <main className="mx-auto max-w-5xl p-8 text-black">
        <div className="rounded-3xl border-2 border-black bg-white p-6 text-red-600">
          {errUpcoming?.message || errPast?.message}
        </div>
      </main>
    );
  }

  console.log(upcoming[0]);

  return (
    <main className="">
      <Hero userType={userType} />
      <PreviewBanner />
      <div className="px-20">
        <Tabs defaultValue="upcoming" className="gap-8">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent
            value="upcoming"
            className="flex flex-wrap gap-8"
          >
            {upcoming.map((event) => toEventItem(event)).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </TabsContent>
          <TabsContent
            value="past"
            className="flex flex-wrap gap-8"
          >
            {past.map((event) => toEventItem(event)).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CSUN Club Finder
      </footer>
    </main>
  );
}
