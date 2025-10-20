// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// type ClubRow = { id: string; discord_channel_id: string | null };

// export default function ClubDiscordBanner() {
//   const [isLoggedInClub, setIsLoggedInClub] = useState(false);
//   const [club, setClub] = useState<ClubRow | null>(null);

//   useEffect(() => {
//     (async () => {
//       console.log("🔍 Running banner check...");

//       const { data: { user }, error: userErr } = await supabase.auth.getUser();
//       console.log("👤 User:", user, "Error:", userErr);

//       if (!user) {
//         console.log("❌ No user logged in — exiting banner check.");
//         return;
//       }

//       // check role
//       const { data: profile, error: profileErr } = await supabase
//         .from("profiles")
//         .select("role")
//         .eq("user_id", user.id)
//         .maybeSingle();

//       console.log("📜 Profile:", profile, "Error:", profileErr);

//       if (profile?.role !== "club") {
//         console.log("⚙️ User is not a club (role =", profile?.role, ")");
//         return;
//       }

//       setIsLoggedInClub(true);

//       // fetch club info
//       const { data: clubRow, error: clubErr } = await supabase
//         .from("clubs")
//         .select("id, discord_channel_id")
//         .eq("owner_user_id", user.id)
//         .maybeSingle();

//       console.log("🏛️ ClubRow:", clubRow, "Error:", clubErr);

//       if (clubRow) setClub(clubRow);
//     })();
//   }, []);

//   console.log("🎯 Render check:", { isLoggedInClub, club });

//   // show banner for clubs who either have no club row OR no discord channel set
//   if (!isLoggedInClub) return null;

//   const needsDiscord = !club || !club.discord_channel_id;
//   if (!needsDiscord) return null;

//   console.log("✅ Banner visible!");
//   return (
//     <div className="rounded border p-3 bg-yellow-50 text-sm mb-4">
//       🚀 Tip: Connect your Discord to auto-post events.{" "}
//       <a href="/dashboard" className="underline">Open dashboard</a>
//     </div>
//   );
// }