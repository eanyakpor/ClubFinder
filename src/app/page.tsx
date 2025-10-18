// src/app/page.tsx
export const revalidate = 0;            // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import { supabaseBrowser } from "./lib/supabase";
import PreviewBanner from "./components/PreviewBanner";

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

  if (errUpcoming || errPast) {
    return (
      <main className="mx-auto max-w-5xl p-8 text-black">
        <div className="rounded-3xl border-2 border-black bg-white p-6 text-red-600">
          {errUpcoming?.message || errPast?.message}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8 text-black">
      <PreviewBanner />
      

<form  className="max-w-md mx-auto">
      <label htmlFor="search-input" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>

      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>

        <input id="search-input"  type="search" 
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-blue-500 focus:border-blue-500" required />

        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
          Search
        </button>
      </div>
    </form>





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

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CSUN Club Finder
      </footer>
    </main>
  );
}