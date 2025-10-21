"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FormState = {
  event_name: string;
  date: string;
  time: string;
  location?: string;
  other?: string;
  repeat_weekly?: boolean;
  repeat_until?: string;
  post_to_discord?: boolean;
};

type ClubRow = {
  id: string;
  discord_channel_id: string | null;
  name?: string | null;
  email?: string | null;
};

interface CreateEventFormProps {
  onSuccess?: () => void;
}

function CreateEventForm({ onSuccess }: CreateEventFormProps) {
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState<FormState>({
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
  const [clubInfo, setClubInfo] = useState<ClubRow | null>(null);
  const [discordConnected, setDiscordConnected] = useState<boolean>(false);
  const [needsClubOnboarding, setNeedsClubOnboarding] =
    useState<boolean>(false);

  function onChange<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setErr("Please log in to create events.");
      return;
    }

    if (!profile) {
      setErr("Profile not found. Please complete your profile setup.");
      return;
    }

    if (profile.profile_type !== "club") {
      setErr("Only club accounts can create events.");
      return;
    }

    // Load club data
    (async () => {
      const { data: club, error } = await supabase
        .from("clubs")
        .select("id, discord_channel_id, name, email")
        .eq("owner_user_id", user.id)
        .maybeSingle<ClubRow>();

      if (error) {
        console.error("Failed to load club:", error);
        setErr("Error loading club data. Please try again.");
        return;
      }

      if (!club) {
        setNeedsClubOnboarding(true);
        setClubId(null);
        setDiscordConnected(false);
        return;
      }

      setNeedsClubOnboarding(false);
      setClubId(club.id);
      setClubInfo(club);
      setDiscordConnected(!!club.discord_channel_id);
    })();
  }, [user, profile, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);

    if (!user) {
      setErr("You must be logged in to create events.");
      setSubmitting(false);
      return;
    }
    if (!clubInfo?.name) {
      setErr("Club information not loaded. Please refresh.");
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
      // Validate date/time format
      const startDate = new Date(`${form.date}T${form.time}`);
      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid date or time format");
      }
      const startIso = startDate.toISOString();

      const payload = {
        club_name: clubInfo.name,
        title: form.event_name.trim(),
        description: form.other?.trim() || null,
        location: form.location?.trim() || null,
        start_time: startIso,
        contact_email: clubInfo.email || null,
        status: "pending",
        repeat_weekly: !!form.repeat_weekly,
        repeat_until: form.repeat_until ? form.repeat_until : null,
        owner_user_id: user.id,
      };

      console.log("Inserting event payload:", payload);
      console.log("Current user:", user);

      // Get the current session to ensure we're authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Current session:", session ? "exists" : "missing");

      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Database error: ${error.message}`);
      }

      console.log("Event inserted successfully:", data);

      // Post to Discord if enabled
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
            setOk("Event created and posted to Discord!");
          } else {
            setOk("Event created but failed to post to Discord.");
          }
        } catch (discordError) {
          console.error("Discord posting failed:", discordError);
          setOk("Event created but failed to post to Discord.");
        }
      } else {
        setOk("Event created successfully!");
      }

      // Reset form
      setForm({
        event_name: "",
        date: "",
        time: "",
        location: "",
        other: "",
        repeat_weekly: false,
        repeat_until: "",
        post_to_discord: false,
      });

      // Call success callback to close modal
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (e: any) {
      console.error("Insert failed:", e);
      setErr(e?.message ?? "Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (needsClubOnboarding) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">You need to complete club onboarding first.</p>
        <Button asChild>
          <a href="/onboarding/club">Complete Club Setup</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-10rem)] overflow-y-auto px-6">
      {clubInfo && (
        <div className="p-3 bg-blue-400/20 border border-blue-600/20 rounded-md">
          <p className="text-sm font-medium text-blue-900">
            Creating event for:
          </p>
          <p className="text-blue-800">
            <strong>{clubInfo.name}</strong>
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="event_name">
            Event Name <span className="text-red-600">*</span>
          </Label>
          <Input
            id="event_name"
            required
            value={form.event_name}
            onChange={(e) => onChange("event_name", e.target.value)}
            placeholder="e.g., Hack Night"
            className="border-border"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">
              Date <span className="text-red-600">*</span>
            </Label>
            <Input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="border-border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="time">
              Time <span className="text-red-600">*</span>
            </Label>
            <Input
              id="time"
              type="time"
              required
              value={form.time}
              onChange={(e) => onChange("time", e.target.value)}
              className="border-border"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">
            Location <span className="text-xs text-gray-500">(optional)</span>
          </Label>
          <Input
            id="location"
            value={form.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g., Sierra Hall 123"
            className="border-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="other">
            Description{" "}
            <span className="text-xs text-gray-500">(optional)</span>
          </Label>
          <Textarea
            id="other"
            value={form.other || ""}
            onChange={(e) => onChange("other", e.target.value)}
            placeholder="Event description, RSVP links, or extra details"
            className="border-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={form.repeat_weekly || false}
              onCheckedChange={(checked) =>
                onChange("repeat_weekly", checked === true)
              }
              className="bg-card cursor-pointer border-border"
            />
            Repeats Weekly
          </label>
        </div>

        {form.repeat_weekly && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="repeat_until">
              Repeat Until{" "}
              <span className="text-xs text-gray-500">(optional)</span>
            </Label>
            <Input
              id="repeat_until"
              type="date"
              value={form.repeat_until || ""}
              onChange={(e) => onChange("repeat_until", e.target.value)}
            />
          </div>
        )}

        {/* Discord Section */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Post to Discord?</h3>

          {!discordConnected ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Add a bot to post events to your server.
              </p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="default" size="sm" asChild>
                  <a href="/onboarding/discord">Connect Discord</a>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="post_to_discord"
                  checked={form.post_to_discord || false}
                  onCheckedChange={(checked) =>
                    onChange("post_to_discord", checked === true)
                  }
                  className="bg-card cursor-pointer border-border"
                />
                <label htmlFor="post_to_discord" className="text-sm">
                  Post this event to Discord
                </label>
              </div>
              <p className="text-xs text-green-600">✓ Discord connected</p>
            </div>
          )}
        </div>

        {ok && <p className="text-green-600 text-sm">{
          "Event created successfully!"
      }</p>}
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <Button type="submit" disabled={submitting || !form.event_name || !form.date || !form.time} className="w-full">
          {submitting ? "Creating..." : "Create Event"}
        </Button>
        {ok && (
          <Link href="/dashboard/club-events">
            <Button variant='outline' className="w-full">
              View Your Events
            </Button>
          </Link>
        )}
      </form>
    </div>
  );
}

export default CreateEventForm;
