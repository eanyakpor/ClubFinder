/*
  This is the main landing page, showing upcoming and past events.
*/

// because by default Next.js caches pages, we need to disable caching to see live data

export const revalidate = 0; // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import PreviewBanner from "./components/PreviewBanner";
// import ClubBanner from "./components/ClubBanner";
import HomeHero from "./components/HomeHero";
import EventsSection from "./components/EventsSection/EventsSection";
import Footer from "./components/Footer/Footer";
import SearchView from "./components/SearchView";
import { getAllEventsData } from "../lib/eventsClient";

export default async function Home() {
  const { upcoming, past, today, error } = await getAllEventsData();

  if (error) {
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

  if (errUpcoming || errPast) {
    return (
      <main className="mx-auto max-w-5xl p-8 text-black">
        <div className="rounded-3xl border-2 border-black bg-white p-6 text-red-600">
          {error}
        </div>
      </main>
    );
  }

const user = {
    name: "John Doe",
    isClub: true,
    interests: [
      "Art",
      "Business",
      "STEM",
      "Sports",
      "Music",
      "Dance",
      "Theater",
      "Film",
      "Literature",
      "Writing",
      "Photography",
    ], // 12 interests
  };
  

  console.log(upcoming[0]); // For debugging

  return (
    <main className="">
      <HomeHero user={user} />
      <EventsSection upcoming={upcoming} past={past} today={today} />
      <SearchView upcoming_full={upcoming} past_full={past} />
      <Footer />

    </main>
  );
}
