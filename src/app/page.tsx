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
import { getAllEventsData } from "../lib/eventsClient";

export default async function Home() {
  const { upcoming, past, today, error } = await getAllEventsData();

  if (error) {
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

  return (
    <main className="">
      <HomeHero user={user} />
      {/* <PreviewBanner /> */}
      {/* <ClubBanner /> */}
      <EventsSection upcoming={upcoming} past={past} today={today} />
      <Footer />
    </main>
  );
}
