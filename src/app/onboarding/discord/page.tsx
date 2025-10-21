"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../../components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, ArrowRight, SkipForward } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Guild = { id: string; name: string; icon?: string | null };
type Channel = { id: string; name: string; type: number };

export default function DiscordOnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [clubId, setClubId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [discordLoading, setDiscordLoading] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [guildId, setGuildId] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");

  const [msg, setMsg] = useState<string>("");
  const [step, setStep] = useState<"intro" | "connect" | "configure">("intro");

  // Read OAuth callback parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const c = url.searchParams.get("clubId");
    const t = url.searchParams.get("accessToken");
    const err = url.searchParams.get("err");
    const detail = url.searchParams.get("detail");

    if (c) setClubId(c);
    if (t) {
      setAccessToken(t);
      setStep("configure");
    }

    // Handle OAuth errors
    if (err) {
      if (err === "missing_code") {
        setMsg(
          "❌ OAuth error: Missing authorization code. Please try signing in again."
        );
      } else if (err === "missing_state") {
        setMsg(
          "❌ OAuth error: Missing state parameter. Please try signing in again."
        );
      } else if (err === "oauth") {
        setMsg(
          `❌ OAuth error: ${
            detail || "Authentication failed"
          }. Please try signing in again.`
        );
      } else {
        setMsg(`❌ Error: ${err}${detail ? ` - ${detail}` : ""}`);
      }
    }
  }, []);

  const hasToken = useMemo(
    () => Boolean(accessToken && accessToken.length > 0),
    [accessToken]
  );

  // Redirect if not authenticated or not a club
  if (!loading && (!user || (profile && profile.profile_type !== "club"))) {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  async function loadGuilds() {
    if (!accessToken) {
      setMsg("No access token. Please sign in with Discord again.");
      return;
    }
    setMsg("");
    setDiscordLoading(true);
    try {
      const r = await fetch(
        `/api/discord/guilds?accessToken=${encodeURIComponent(accessToken)}`,
        {
          cache: "no-store",
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load guilds");
      setGuilds(data.guilds || []);
    } catch (e: any) {
      setMsg(e.message || "Failed to load guilds");
    } finally {
      setDiscordLoading(false);
    }
  }

  async function onGuildChange(id: string) {
    setGuildId(id);
    setChannelId("");
    setChannels([]);
    if (!id) return;

    setMsg("");
    setDiscordLoading(true);
    try {
      const r = await fetch(
        `/api/discord/channels?guildId=${encodeURIComponent(id)}`,
        {
          cache: "no-store",
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load channels");
      setChannels(data.channels || []);
    } catch (e: any) {
      setMsg(e.message || "Failed to load channels");
    } finally {
      setDiscordLoading(false);
    }
  }

  async function saveAndContinue() {
    if (!guildId || !channelId) {
      setMsg("Please select a server and channel.");
      return;
    }
    setMsg("");
    setDiscordLoading(true);
    try {
      // During onboarding, we don't have a clubId yet
      // Store the Discord info in localStorage to use after club creation
      if (!clubId || clubId === "onboarding") {
        localStorage.setItem(
          "pendingDiscordConfig",
          JSON.stringify({
            guildId,
            channelId,
            accessToken,
          })
        );
        setMsg("✅ Discord configuration saved! Proceeding to club setup...");
        setTimeout(() => {
          router.push("/onboarding/club");
        }, 1500);
        return;
      }

      // If we have a real clubId, save immediately
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        throw new Error("Please log in again to save Discord settings.");
      }

      const r = await fetch("/api/discord/save-target", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ clubId, guildId, channelId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Save failed");

      // Redirect to club onboarding
      router.push("/onboarding/club");
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setDiscordLoading(false);
    }
  }

  function skipDiscord() {
    router.push("/onboarding/club");
  }

  if (step === "intro") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connect Your Discord Bot
            </h1>
            <p className="text-gray-600">
              Automatically post your events to Discord and engage with your
              community
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Why Connect Discord?</CardTitle>
              <CardDescription>
                Streamline your club's communication and event promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Automatic Event Posts:</strong> Your events will be
                    automatically shared in your Discord server
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Real-time Updates:</strong> Members get notified
                    about new events and changes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Increased Engagement:</strong> Reach your Discord
                    community where they're already active
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    <strong>Easy Management:</strong> One place to manage
                    events, multiple places to share them
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setStep("connect")}
              className="px-8 py-2 text-lg"
              size="lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Connect Discord Bot
            </Button>
            <Button
              variant="outline"
              onClick={skipDiscord}
              className="px-8 py-2 text-lg"
              size="lg"
            >
              <SkipForward className="mr-2 h-5 w-5" />
              Skip for Now
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            You can always connect Discord later from your club settings
          </p>
        </div>
      </div>
    );
  }

  if (step === "connect" || (step === "configure" && !hasToken)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in with Discord
            </h1>
            <p className="text-gray-600">
              We need access to your Discord servers to set up the bot
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm mb-4 text-gray-600">
                  This will allow us to list your Discord servers and channels
                </p>
                <a
                  className="inline-flex items-center justify-center rounded-md bg-[#5865F2] text-white px-6 py-3 font-medium hover:bg-[#4752C4] transition-colors"
                  href={`/api/discord/oauth/start?state=${encodeURIComponent(
                    clubId || "onboarding"
                  )}&return_to=${encodeURIComponent("/onboarding/discord")}`}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Sign in with Discord
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setStep("intro")}
              className="text-sm text-gray-600"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Configure step
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Configure Discord Bot
          </h1>
          <p className="text-gray-600">
            Choose where your events should be posted
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Bot Invitation Step */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Step 1: Invite Bot to Your Server
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Before we can access your Discord channels, you need to invite
                our bot to your server.
              </p>
              <a
                href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=2048&scope=bot`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#5865F2] text-white px-4 py-2 text-sm font-medium hover:bg-[#4752C4] transition-colors"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Invite Bot to Server
              </a>
              <p className="text-xs text-blue-600 mt-2">
                This opens in a new tab. Come back here after inviting the bot.
              </p>
            </div>

            {/* Load Guilds */}
            {guilds.length === 0 && (
              <div>
                <p className="text-sm mb-3 text-gray-600">
                  Step 2: Load your Discord servers (after inviting the bot):
                </p>
                <Button
                  onClick={loadGuilds}
                  disabled={discordLoading}
                  className="w-full"
                >
                  {discordLoading ? "Loading..." : "Load Discord Servers"}
                </Button>
              </div>
            )}

            {/* Select Guild */}
            {guilds.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Discord Server
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-white"
                  value={guildId}
                  onChange={(e) => onGuildChange(e.target.value)}
                >
                  <option value="">Select a server...</option>
                  {guilds.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  If your server isn't listed, make sure the bot has been
                  invited to it using the link above
                </p>
              </div>
            )}

            {/* Select Channel */}
            {channels.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Channel for Events
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-white"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                >
                  <option value="">Select a channel...</option>
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={saveAndContinue}
              disabled={!guildId || !channelId || discordLoading}
              className="w-full"
            >
              {discordLoading ? (
                "Saving..."
              ) : (
                <>
                  Save & Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {msg && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              msg.startsWith("✅")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={skipDiscord}
            className="text-sm text-gray-600"
          >
            Skip Discord Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
