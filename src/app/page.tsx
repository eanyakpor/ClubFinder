// src/app/page.tsx
export const revalidate = 0;            // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering

import { supabaseBrowser } from "./lib/supabase";
import PreviewBanner from "./components/PreviewBanner";
import Hero from "./components/Hero/Hero";

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
    <main className="">
      <Hero userType="student" />
      <PreviewBanner />
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