// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function SocialMediaDashboardPage() {
//   const [loading, setLoading] = useState(true);
//   const [clubId, setClubId] = useState<string | null>(null);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setErr(null);

//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       if (userErr) {
//         setErr(userErr.message ?? "Auth error. Please sign in again.");
//         setLoading(false);
//         return;
//       }
//       if (!user) {
//         setErr("Please sign in to manage integrations.");
//         setLoading(false);
//         return;
//       }

//       const { data: club, error: clubErr } = await supabase
//         .from("clubs")
//         .select("id")
//         .eq("owner_user_id", user.id)
//         .maybeSingle();

//       if (clubErr) {
//         setErr(clubErr.message ?? "Could not load your club record.");
//       } else {
//         setClubId(club?.id ?? null);
//       }
//       setLoading(false);
//     })();
//   }, []);

//   const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
//   const inviteLink = discordClientId
//     ? `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&permissions=0&scope=bot`
//     : null;

//   return (
//     <main className="mx-auto max-w-xl p-6 text-black">
//       <h1 className="text-2xl font-bold mb-2">Social Media Connections</h1>
//       <p className="text-sm text-gray-600 mb-6">
//         Connect your club to Discord so new events can auto-post to your server.
//       </p>

//       {loading && <p>Loading…</p>}
//       {err && <p className="text-red-600 text-sm mb-4">{err}</p>}

//       {!loading && !err && (
//         <div className="space-y-6">
//           <section className="rounded border p-4">
//             <h2 className="font-medium mb-2">Discord</h2>
//             <p className="text-sm text-gray-600 mb-3">
//               Do you want to connect your Discord? First invite the bot to your server, then connect and pick a channel.
//             </p>

//             <div className="flex flex-wrap gap-3">
//               {inviteLink ? (
//                 <a
//                   href={inviteLink}
//                   className="inline-flex items-center justify-center rounded bg-[#5865F2] px-4 py-2 text-white hover:opacity-90"
//                 >
//                   Invite Bot to Server
//                 </a>
//               ) : (
//                 <span className="text-sm text-gray-500">
//                   Missing NEXT_PUBLIC_DISCORD_CLIENT_ID
//                 </span>
//               )}

//               <a
//                 href={clubId ? `/api/discord/oauth/start?state=${encodeURIComponent(clubId)}&return_to=${encodeURIComponent('/clubform')}` : "#"}
//                 aria-disabled={!clubId}
//                 className={`inline-flex items-center justify-center rounded px-4 py-2 text-white ${
//                   clubId ? "bg-black hover:opacity-90" : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {clubId ? "Connect Discord (pick channel)" : "Connect Discord (club not found)"}
//               </a>
//             </div>
//           </section>
//         </div>
//       )}
//     </main>
//   );
// }

import React from 'react'

function SocialMediaDashboard() {
  return (
    <div>page</div>
  )
}

export default SocialMediaDashboard
