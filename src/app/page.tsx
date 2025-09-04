// import { query } from './lib/db'
import { supabaseBrowser } from "./lib/supabase";
import { redirect } from "next/navigation";

// csun_club table rows in database defined 
type Row = {
  id: string;
  name: string;
  type: "sports" | "organization";
  pitch: string | null;
  weekday: string | null;
  time_range: string | null;
  location: string | null;
  instagram: string | null;
  discord: string | null;
  website: string | null;
}

export default async function Home() {
  redirect("/waitlist");
  // const sb = supabaseBrowser();

  // const { data: clubs, error } = await sb
  //   .from("clubs")
  //   .select("id,name,type,pitch,instagram,discord,website,is_active")
  //   .eq("is_active", true)
  //   .order("name");

  // if (error) return <div className="p-6">Error: {error.message}</div>;

  // // 2) meetings (simple approach: fetch all and map)
  // const { data: meetings } = await sb
  //   .from("meetings")
  //   .select("club_id,weekday,time_range,location");

  // const byClubId = new Map((meetings ?? []).map(m => [m.club_id, m]));

  // const rows: Row[] = (clubs ?? []).map(c => ({
  //   ...c,
  //   weekday: byClubId.get(c.id)?.weekday ?? null,
  //   time_range: byClubId.get(c.id)?.time_range ?? null,
  //   location: byClubId.get(c.id)?.location ?? null,
  // })) as any;

  // return (
  //   <div className="grid gap-4">
  //     {rows.map((c) => (
  //       <article key={c.id} className=" text-black rounded-2x1 border bg-white p-4 shawdow-sm">
  //         <div className="flex items-center justify-between">
  //           <h3 className="text-lg font-semibold">{c.name}</h3>
  //           <span className="rounded-full border px-2 py-0.5 text-xs">
  //             {c.type}
  //           </span>
  //         </div>

  //         {c.pitch && <p className="mt-1 text sm text-grey-700">{c.pitch}</p>}
  //         {(c.weekday || c.time_range || c.location) && (
  //         <p className="mt-2 text-sm">
  //           <span className="font-medium">Meeting: </span>
  //           {[c.weekday, c.time_range].filter(Boolean).join(" ")}
  //           {c.location ? ` @ ${c.location}` : ""}
  //         </p>
  //       )}
  //       </article>
  //     ))}
  //   </div>
  // );
}
