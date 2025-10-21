/*
  This is the main landing page, showing upcoming and past events.
*/

// because by default Next.js caches pages, we need to disable caching to see live data

export const revalidate = 0; // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import HomeHero from "./components/HomeHero";
import EventsSection from "./components/EventsSection/EventsSection";
import Footer from "./components/Footer/Footer";
import SearchView from "./components/SearchView";
import { getAllEventsData } from "../lib/eventsClient";

export default async function Home() {
  const { upcoming, past, today, error } = await getAllEventsData();

  return (
      <main className="">
        <HomeHero />
        <EventsSection upcoming={upcoming} past={past} today={today} />
        <SearchView upcoming_full={upcoming} past_full={past} />
        <Footer />
      </main>
  );
}
