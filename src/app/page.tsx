/*
  This is the main landing page, showing upcoming and past events.
*/

// because by default Next.js caches pages, we need to disable caching to see live data

export const revalidate = 0;            // don't cache this page
// src/app/page.tsx
export const revalidate = 0; // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import { getSupabaseClient } from "./lib/supabase";
import PreviewBanner from "./components/PreviewBanner";
import ClubBanner from "./components/ClubBanner";
import SignOutButton from "./components/SignOutButton";
import Hero from "./components/Hero/Hero";
import EventCard from "./components/EventList/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventItem } from "./lib/data";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import NavBar from "./components/NavBar/NavBar";

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
  const supabase = getSupabaseClient();
  const nowIso = new Date().toISOString(); // compare in UTC (DB stores UTC)

  const { data: upcoming, error: errUpcoming } = await supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", nowIso)
    .order("start_time", { ascending: true });

  const { data: past, error: errPast } = await supabase
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })
    .limit(10);

  const { data: today, error: errToday } = await sb
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .eq("start_time", nowIso)
    .order("start_time", { ascending: true });

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

  if (errUpcoming || errPast || errToday) {
    return (
      <main className="mx-auto max-w-5xl p-8 text-black">
        <div className="rounded-3xl border-2 border-black bg-white p-6 text-red-600">
          {errUpcoming?.message || errPast?.message || errToday?.message}
        </div>
      </main>
    );
  }

  // Mock data for today
  if (today.length === 0) {
    today.push({
      id: "1",
      title: "NextGen Hacks",
      club_name: "Society of Software Engineers",
      start_time: nowIso,
      location: "California State University, Northridge",
      description: "Description 1",
    });
    today.push({
      id: "1",
      title: "NextGen Hacks",
      club_name: "Society of Software Engineers",
      start_time: nowIso,
      location: "California State University, Northridge",
      description: "Description 1",
    });
    today.push({
      id: "1",
      title: "NextGen Hacks",
      club_name: "Society of Software Engineers",
      start_time: nowIso,
      location: "California State University, Northridge",
      description: "Description 1",
    });
  }

  console.log(upcoming[0]); // For debugging

  const user = {
    name: "John Doe",
    isClub: true,
    interests: ["Art", "Business", "STEM", "Sports", "Music", "Dance", "Theater", "Film", "Literature", "Writing", "Photography"], // 12 interests
  }


  return (
    <main className="">
      <NavBar user={user}/>
      <Hero user={user} />
      <PreviewBanner />
      <ClubBanner/>
      <SignOutButton/>
      <section className="mb-12">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight">Upcoming Events</h1>

        {!upcoming?.length ? (
          <div className="rounded-3xl border-2 border-black bg-white p-8">
            <p className="text-lg text-gray-600">No upcoming events yet.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {upcoming.map((e) => (
              <li key={e.id}>
                <article className="rounded-2xl border bg-white p-4 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">{e.club_name}</h3>
                  <p className="text-lg text-gray-600 italic">{e.title}</p>
                  <p className="mt-1 text-lg text-gray-700">
                    {fmtDate(e.start_time)}
                    {e.location ? ` • ${e.location}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-2 text-lg text-gray-600">{e.description}</p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* PAST */}
      <section>
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Past Events</h2>

        {!past?.length ? (
          <div className="rounded-3xl border-2 border-black bg-white p-8">
            <p className="text-lg text-gray-600">No past events.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {past.map((e) => (
              <li key={e.id}>
                <article className="rounded-3xl border-2 border-black bg-white p-7">
                  <h3 className="text-2xl font-extrabold leading-snug">{e.club_name}</h3>
                  <p className="text-lg text-gray-600 italic">{e.title}</p>
                  <p className="mt-3 text-base text-gray-700">
                    {fmtDate(e.start_time)}
                    {e.location ? ` • ${e.location}` : ""}
                  </p>
                  {e.description && (
                    <p className="mt-4 text-base leading-relaxed text-gray-700">{e.description}</p>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="flex justify-center px-20 gap-8">
        <div className="">
          <Tabs
            defaultValue="upcoming"
            className="flex flex-col items-center xl:items-start justify-center gap-0"
          >
            {/* Today's Events (Mobile) */}
            <Card className=" xl:hidden w-[350px] md:w-md xl:w-xl h-min mb-4">
              <CardTitle className="px-6">
                <h1>Events Today</h1>
              </CardTitle>
              <CardContent className="flex flex-col gap-4">
                {today
                  .map((event) => toEventItem(event))
                  .map((event) => (
                    <Card className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200">
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
                <TabsTrigger value="upcoming" className="cursor-pointer ">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="cursor-pointer ">
                  Past Events
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex flex-col xl:flex-row justify-center items-center xl:items-start gap-8">
              {/* Event List */}
              <TabsContent value="upcoming">
                <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8`}>
                  {upcoming
                    .map((event) => toEventItem(event))
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="past">
                <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8`}>
                  {past
                  .map((event) => toEventItem(event))
                  .map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
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
                      <Card className="gap-4 cursor-pointer hover:brightness-95 transition-all duration-200">
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

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CSUN Club Finder
      </footer>
    </main>
  );
}
