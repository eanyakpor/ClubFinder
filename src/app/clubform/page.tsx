"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AddDiscordIntegration from "../components/Integrations/AddDiscordIntegration";
import ConnectToDiscordButton from "../components/Integrations/AddToDiscordButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FormState = {
  club_name: string;        // required
  club_email?: string;      // optional
  event_name: string;       // required
  date: string;             // required (yyyy-mm-dd)
  time: string;             // required (hh:mm)
  location?: string;        // optional
  other?: string;           // optional
  repeat_weekly?: boolean;  // optional
  repeat_until?: string;    // optional (yyyy-mm-dd)
  post_to_discord?: boolean; // optional
};

type ClubRow = {
  id: string;
  discord_channel_id: string | null;
  name?: string | null;
  email?: string | null;
};

export default function ClubFormPage() {
  const [form, setForm] = useState<FormState>({
    club_name: "",
    club_email: "",
    event_name: "",
    date: "",
    time: "",
    location: "",
    other: "",
    repeat_weekly: false,
    repeat_until: "",
    post_to_discord: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [discordConnected, setDiscordConnected] = useState<boolean>(false);
  const [needsClubOnboarding, setNeedsClubOnboarding] = useState<boolean>(false);

  function onChange<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  useEffect(() => {
    (async () => {
      console.log("[clubform] loading user + club…");
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error("[clubform] getUser error:", userErr);
        setErr("Authentication error. Please log in again.");
        return;
      }
      if (!user) {
        console.log("[clubform] no user; redirecting to login");
        window.location.href = "/login";
        return;
      }

      // Check if user has club role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.role !== "club") {
        setErr("This page is only for club accounts. Please log in with a club account.");
        return;
      }

      const { data: club, error } = await supabase
        .from("clubs")
        .select("id, discord_channel_id, name, email")
        .eq("owner_user_id", user.id)
        .maybeSingle<ClubRow>();

      if (error) {
        console.error("[clubform] failed to load club:", error);
        return;
      }

      if (!club) {
        console.log("[clubform] no club row found for this user; prompt onboarding");
        setNeedsClubOnboarding(true);
        setClubId(null);
        setDiscordConnected(false);
        return;
      }

      console.log("[clubform] club loaded:", club);
      setNeedsClubOnboarding(false);
      setClubId(club.id);
      setDiscordConnected(!!club.discord_channel_id);
    })();
  }, []);

  useEffect(() => {
    console.log("[clubform] clubId state now:", clubId, "discordConnected:", discordConnected);
  }, [clubId, discordConnected]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    // ✅ Client-side required checks
    if (!form.club_name?.trim()) {
      setErr("Please provide the Name of Club.");
      setSubmitting(false);
      return;
    }
    if (!form.event_name?.trim()) {
      setErr("Please provide the Event Name.");
      setSubmitting(false);
      return;
    }
    if (!form.date) {
      setErr("Please pick a Date.");
      setSubmitting(false);
      return;
    }
    if (!form.time) {
      setErr("Please pick a Time.");
      setSubmitting(false);
      return;
    }

    try {
      const startIso = new Date(`${form.date}T${form.time}`).toISOString();

      const payload = {
        club_name: form.club_name.trim(),
        title: form.event_name.trim(),
        description: form.other?.trim() || null,
        location: form.location?.trim() || null,
        start_time: startIso,
        contact_email: form.club_email?.trim() || null, // optional
        status: "pending",
        repeat_weekly: !!form.repeat_weekly,
        repeat_until: form.repeat_until || null,        // YYYY-MM-DD accepted by Postgres date
      };

      const { error } = await supabase.from("events").insert(payload);
      if (error) throw error;

      // Post to Discord if enabled and Discord is connected
      if (form.post_to_discord && clubId && discordConnected) {
        try {
          const discordPayload = {
            clubId,
            title: form.event_name.trim(),
            description: form.other?.trim() || null,
            location: form.location?.trim() || null,
            start_time: startIso,
          };

          const discordResponse = await fetch("/api/discord/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload),
          });

          if (discordResponse.ok) {
            setOk("Submitted! Event saved and posted to Discord. We'll review it before it appears on the homepage.");
          } else {
            setOk("Submitted! Event saved but failed to post to Discord. We'll review it before it appears on the homepage.");
          }
        } catch (discordError) {
          console.error("Discord posting failed:", discordError);
          setOk("Submitted! Event saved but failed to post to Discord. We'll review it before it appears on the homepage.");
        }
      } else {
        setOk("Submitted! We'll review it before it appears on the homepage.");
      }

      setForm({
        club_name: "",
        club_email: "",
        event_name: "",
        date: "",
        time: "",
        location: "",
        other: "",
        repeat_weekly: false,
        repeat_until: "",
        post_to_discord: false,
      });
    } catch (e: any) {
      console.error("Insert failed:", e);
      setErr(e?.message ?? "Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 text-black">
      <h1 className="text-2xl font-bold">Submit or Update Club Event</h1>
      <p className="mb-6 mt-1 text-sm">We’ll review before it appears on the homepage.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Name of Club <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            required
            value={form.club_name}
            onChange={(e) => onChange("club_name", e.target.value)}
            placeholder="e.g., CSUN ACM"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Club Email <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            type="email"
            value={form.club_email}
            onChange={(e) => onChange("club_email", e.target.value)}
            placeholder="club@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Event Name <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            required
            value={form.event_name}
            onChange={(e) => onChange("event_name", e.target.value)}
            placeholder="e.g., Hack Night"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              type="date"
              required
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Time <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              type="time"
              required
              value={form.time}
              onChange={(e) => onChange("time", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.repeat_weekly || false}
              onChange={(e) => onChange("repeat_weekly", e.target.checked)}
            />
            Repeats Weekly
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Repeat Until <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            type="date"
            value={form.repeat_until || ""}
            onChange={(e) => onChange("repeat_until", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Location <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            type="text"
            value={form.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g., Sierra Hall 123"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Other info <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <textarea
            className="w-full rounded border px-3 py-2"
            rows={4}
            value={form.other || ""}
            onChange={(e) => onChange("other", e.target.value)}
            placeholder="Flyer/RSVP links or extra details"
          />
        </div>

      

        {/* 👇 Discord section right before Submit */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Post this event to Discord?</h3>
          <p className="text-xs text-gray-600 mb-3">
            Connect your Discord server to enable automatic event posting.
          </p>
          
          {needsClubOnboarding ? (
            <div className="flex items-center gap-2">
              <a href="/onboarding/club" className="px-3 py-2 rounded border text-sm">
                Create your club first
              </a>
            </div>
          ) : !discordConnected ? (
            <div className="flex items-center gap-2">
              <a 
                href="/SocialMediaDashboard" 
                className="px-4 py-2 rounded bg-[#5865F2] text-white text-sm hover:opacity-90"
              >
                Connect Discord
              </a>
              <span className="text-xs text-gray-500">
                Set up Discord integration to enable posting
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="post_to_discord"
                  checked={form.post_to_discord || false}
                  onChange={(e) => onChange("post_to_discord", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="post_to_discord" className="text-sm font-medium">
                  Post this event to Discord
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600">✓ Discord connected</span>
                <a 
                  href="/SocialMediaDashboard" 
                  className="text-xs text-blue-600 hover:underline"
                >
                  Manage settings
                </a>
              </div>
            </div>
          )}
        </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-black px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>

      {ok && <p className="text-green-600">{ok}</p>}
      {err && <p className="text-red-600">{err}</p>}
      </form>
    </main>
  );
}