// src/app/page.tsx

export const revalidate = 0;            // don't cache this page
export const dynamic = "force-dynamic"; // force dynamic rendering


import { supabaseBrowser } from "./lib/supabase";
import PreviewBanner from "./components/PreviewBanner";
import SearchView from "./search/SearchViewFile";





export default async function Home() {
  const sb = supabaseBrowser();
  const nowIso = new Date().toISOString(); // compare in UTC (DB stores UTC)

  const { data: upcoming_full, error: errUpcoming_full } = await sb
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .gte("start_time", nowIso)
    .order("start_time", { ascending: true });

  let { data: past_full, error: errPast_full } = await sb
    .from("events")
    .select("id, title, club_name, location, start_time, description")
    .eq("status", "approved")
    .lt("start_time", nowIso)
    .order("start_time", { ascending: false })
    .limit(10);

  if (errUpcoming_full || errPast_full) {
    return (
      <main className="mx-auto max-w-5xl p-8 text-black">
        <div className="rounded-3xl border-2 border-black bg-white p-6 text-red-600">
          {errUpcoming_full?.message || errPast_full?.message}
        </div>
      </main>
    );
  }

  






  return (
    <main className="mx-auto max-w-5xl p-8 text-black">
      <PreviewBanner />
      

      <SearchView 
      upcoming_full={upcoming_full??[]}
      past_full={past_full??[]}
      />

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CSUN Club Finder
      </footer>
    </main>
  );
}