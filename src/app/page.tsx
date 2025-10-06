// src/app/page.tsx
import { supabaseBrowser } from "./lib/supabase";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function Home() {
  const sb = supabaseBrowser();
  const nowIso = new Date().toISOString();

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
      {/* UPCOMING */}
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
                {/* Club name (main header) */}
                <h3 className="text-2xl font-bold text-gray-900">{e.club_name}</h3>

                {/* Event title (secondary, slightly smaller) */}
                <p className="text-lg text-gray-600 italic">{e.title}</p>

                {/* Date + Location */}
                <p className="mt-1 text-lg text-gray-700">
                  {new Date(e.start_time).toLocaleString()}
                  {e.location ? ` • ${e.location}` : ""}
                </p>

                {/* Optional description */}
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
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-2xl font-extrabold leading-snug">{e.title}</h3>

                    <span className="shrink-0 rounded-full border-2 border-black px-4 py-1.5 text-sm font-semibold text-gray-800">
                      {e.club_name ?? "—"}
                    </span>
                  </div>

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

      {/* footer (optional) */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CSUN Club Finder
      </footer>
    </main>
  );
}