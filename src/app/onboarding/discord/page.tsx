"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
import Link from "next/link";


type Guild = { id: string; name: string; icon?: string | null };
type Channel = { id: string; name: string; type: number };

export default function DiscordOnboardingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [clubId, setClubId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "connect" | "configure">("intro");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [guildId, setGuildId] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");
  const [discordLoading, setDiscordLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [botInvited, setBotInvited] = useState(false);

  // Fetch club ID for current user
  useEffect(() => {
    const fetchClubId = async () => {
      if (!user || loading) return;
      
      try {
        const { data: club, error } = await supabase
          .from('clubs')
          .select('id')
          .eq('owner_user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching club:', error);
          return;
        }
        
        if (club) {
          console.log('Found club ID:', club.id);
          setClubId(club.id);
        }
      } catch (error) {
        console.error('Error in fetchClubId:', error);
      }
    };

    fetchClubId();
  }, [user, loading]);

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
          "OAuth error: Missing authorization code. Please try signing in again."
        );
      } else if (err === "missing_state") {
        setMsg(
          "OAuth error: Missing state parameter. Please try signing in again."
        );
      } else if (err === "oauth") {
        setMsg(
          `OAuth error: ${
            detail || "Authentication failed"
          }. Please try signing in again.`
        );
      } else {
        setMsg(`Error: ${err}${detail ? ` - ${detail}` : ""}`);
      }
    }
  }, []);

  const hasToken = useMemo(
    () => Boolean(accessToken && accessToken.length > 0),
    [accessToken]
  );

  // Redirect if not authenticated or not a club
  // Allow access if profile is still loading or if user is a club
  if (!loading && !user) {
    router.push("/");
    return null;
  }
  
  // Only redirect if we have a profile and it's definitely not a club
  if (!loading && profile && profile.profile_type && profile.profile_type !== "club") {
    router.push("/");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gradient-to-b from-primary to-secondary">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
      // Check if we have a club to save to
      console.log("Current clubId:", clubId);
      console.log("Current user:", user?.id);
      if (!clubId || clubId === "onboarding") {
        setMsg("Error: No club found for your account. Please make sure you have completed club onboarding first.");
        setDiscordLoading(false);
        return;
      }

      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      
      console.log("Session check:", {
        sessionError,
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        userId: session?.user?.id
      });
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!session?.access_token) {
        console.error("No access token found in session");
        throw new Error("No valid session found. Please refresh the page and try again.");
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

      // Redirect back to home/dashboard
      setMsg("Discord integration successful! You can now post events to Discord.");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setDiscordLoading(false);
    }
  }

  function skipDiscord() {
    router.push("/");
  }

  if (step === "intro") {
    return (
      <div className="flex md:items-center justify-center h-[calc(100vh-56px)] p-6 overflow-y-auto bg-gradient-to-b from-primary to-background">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Connect Your Discord Bot
            </h1>
            <p className="text-white/80">
              Automatically post your events to Discord and engage with your
              community
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-400/20 rounded-full w-fit">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Why Connect Discord?</CardTitle>
              <CardDescription>
                Streamline your club's communication and event promotion
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-6">
              <p>
                <strong>Automatic Event Posts:</strong> Your events will be
                automatically shared in your Discord server
              </p>
              <p>
                <strong>Real-time Updates:</strong> Members get notified about
                new events and changes
              </p>
              <p>
                <strong>Increased Engagement:</strong> Reach your Discord
                community where they're already active
              </p>
              <p>
                <strong>Easy Management:</strong> One place to manage events,
                multiple places to share them
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setStep("connect")}
              className="px-8 py-2 text-lg cursor-pointer"
              size="lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Connect Discord Bot
            </Button>
            <Button
              variant="outline"
              onClick={skipDiscord}
              className="px-8 py-2 text-lg cursor-pointer"
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
      <div className="flex items-center justify-center h-[calc(100vh-56px)] p-6 overflow-y-auto bg-gradient-to-b from-primary to-background">
        <Card className="w-full max-w-md h-min">
          <CardHeader>
            <CardTitle>Sign in with Discord</CardTitle>
            <CardDescription>
              We need access to your Discord servers to set up the bot
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button className="">
              <Link
                className="flex items-center gap-2"
                href={`/api/discord/oauth/start?state=${encodeURIComponent(
                  clubId || "onboarding"
                )}&return_to=${encodeURIComponent("/onboarding/discord")}`}
              >
                <MessageSquare className=" h-6 w-6" />
                Sign in with Discord
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep("intro")}
              className="text-sm text-muted-foreground"
            >
              ← Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Configure step
  return (
    <div className="flex flex-col items-center md:justify-center h-[calc(100vh-56px)] p-6 gap-6 overflow-y-auto bg-gradient-to-b from-primary to-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Configure Discord Bot
        </h1>
        <p className="text-white/80">
          Choose where your events should be posted
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4">
          {/* Bot Invitation Step */}
          <h3 className="font-medium text-card-foreground">
            Step 1: Invite Bot to Your Server
          </h3>
          <p className="text-sm text-muted-foreground">
            Before we can access your Discord channels, you need to invite our
            bot to your server.
          </p>
          <Button 
            className="cursor-pointer w-min"
            onClick={() => {
              setBotInvited(true);
              window.open(`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=2048&scope=bot`, '_blank');
            }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Invite Bot to Server
          </Button>
          <p className="text-sm text-muted-foreground">
            This opens in a new tab. Come back here after inviting the bot.
          </p>

          {/* Load Guilds */}
          {guilds.length === 0 && (
            <>
              <h3 className="font-medium text-card-foreground">
                Step 2: Load your Discord servers (after inviting the bot):
              </h3>
              <Button
                onClick={loadGuilds}
                disabled={discordLoading || !botInvited}
                className="w-min"
              >
                {discordLoading ? "Loading..." : "Load Discord Servers"}
              </Button>
            </>
          )}

          {/* Select Guild */}
          {guilds.length > 0 && (
            <>
              <h3 className="font-medium text-card-foreground">
                Step 3: Select a Discord Server
              </h3>
              <select
                className="w-min border rounded-md px-3 py-2 bg-card"
                value={guildId}
                onChange={(e) => onGuildChange(e.target.value)}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <option value="" className="text-card-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Select a server...
                </option>
                {guilds.map((g) => (
                  <option
                    key={g.id}
                    value={g.id}
                    className="text-card-foreground"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {g.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Select Channel */}
          {channels.length > 0 && (
            <>
              <h3 className="font-medium text-card-foreground">
                Step 4: Select a Discord Channel
              </h3>
              <select
                className="w-full border rounded-md px-3 py-2 bg-card"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <option value="" className="text-card-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Select a channel...
                </option>
                {channels.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                    className="text-card-foreground"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    #{c.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Save Button */}
          <Button
            onClick={saveAndContinue}
            disabled={!guildId || !channelId || discordLoading}
            className="flex items-center justify-center gap-2"
          >
            {discordLoading ? (
              "Saving..."
            ) : (
              <>
                Save & Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={skipDiscord}
            className="cursor-pointer"
          >
            Skip Discord Setup
          </Button>
        </CardContent>
      </Card>

      {msg && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            msg.includes("saved") || msg.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
