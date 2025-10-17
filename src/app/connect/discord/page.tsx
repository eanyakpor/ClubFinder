"use client";

import { useEffect, useMemo, useState } from "react";

type Guild = { id: string; name: string; icon?: string | null };
type Channel = { id: string; name: string; type: number };

export default function ConnectDiscordQuickSelector() {
  const [clubId, setClubId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [guildId, setGuildId] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");

  const [msg, setMsg] = useState<string>("");

  // read ?clubId=&accessToken= from URL (added by /api/discord/oauth/callback)
  useEffect(() => {
    const url = new URL(window.location.href);
    const c = url.searchParams.get("clubId");
    const t = url.searchParams.get("accessToken");
    const err = url.searchParams.get("err");
    const detail = url.searchParams.get("detail");
    
    if (c) setClubId(c);
    if (t) setAccessToken(t);
    
    // Handle OAuth errors
    if (err) {
      if (err === "missing_code") {
        setMsg("❌ OAuth error: Missing authorization code. Please try signing in again.");
      } else if (err === "missing_state") {
        setMsg("❌ OAuth error: Missing state parameter. Please try signing in again.");
      } else if (err === "oauth") {
        setMsg(`❌ OAuth error: ${detail || "Authentication failed"}. Please try signing in again.`);
      } else {
        setMsg(`❌ Error: ${err}${detail ? ` - ${detail}` : ""}`);
      }
    }
  }, []);

  async function loadGuilds() {
    if (!accessToken) {
      setMsg("No access token. Click 'Sign in with Discord' again.");
      return;
    }
    setMsg("");
    setLoading(true);
    try {
      const r = await fetch(`/api/discord/guilds?accessToken=${encodeURIComponent(accessToken)}`, {
        cache: "no-store",
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load guilds");
      setGuilds(data.guilds || []);
    } catch (e: any) {
      setMsg(e.message || "Failed to load guilds");
    } finally {
      setLoading(false);
    }
  }

  async function onGuildChange(id: string) {
    setGuildId(id);
    setChannelId("");
    setChannels([]);
    if (!id) return;

    setMsg("");
    setLoading(true);
    try {
      const r = await fetch(`/api/discord/channels?guildId=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load channels");
      setChannels(data.channels || []);
    } catch (e: any) {
      setMsg(e.message || "Failed to load channels");
    } finally {
      setLoading(false);
    }
  }

  async function saveTarget() {
    if (!clubId || !guildId || !channelId) {
      setMsg("Missing club, server, or channel.");
      return;
    }
    setMsg("");
    setLoading(true);
    try {
      const r = await fetch("/api/discord/save-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId, guildId, channelId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Save failed");
      setMsg("✅ Saved! You can close this and submit your event.");
      
      // Auto-redirect to club form after 2 seconds
      setTimeout(() => {
        window.location.href = "/clubform";
      }, 2000);
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  const hasToken = useMemo(() => Boolean(accessToken && accessToken.length > 0), [accessToken]);

  return (
    <main className="mx-auto max-w-md p-6 text-black">
      <h1 className="text-2xl font-bold mb-2">Connect Discord</h1>
      <p className="text-sm text-gray-600 mb-4">
        Pick the server and channel where your events should auto-post.
      </p>

      {!hasToken ? (
        <div className="rounded border p-3 bg-gray-50">
          <p className="text-sm mb-3">
            Step 1: Sign in with Discord to list your servers.
          </p>
          <a
            className="inline-block rounded bg-[#5865F2] text-white px-4 py-2"
            href={`/api/discord/oauth/start?state=${encodeURIComponent(clubId || "")}`}
          >
            Sign in with Discord
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded border p-3 bg-gray-50">
            <p className="text-sm mb-3">Step 1: Load your servers</p>
            <button
              onClick={loadGuilds}
              className="rounded border px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading…" : "Load servers"}
            </button>
          </div>

          {guilds.length > 0 && (
            <div className="rounded border p-3">
              <label className="block text-sm font-medium mb-1">Server</label>
              <select
                className="w-full border rounded px-2 py-2"
                value={guildId}
                onChange={(e) => onGuildChange(e.target.value)}
              >
                <option value="">Select a server…</option>
                {guilds.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                If your server isn’t listed, invite the bot first from your Club form.
              </p>
            </div>
          )}

          {channels.length > 0 && (
            <div className="rounded border p-3">
              <label className="block text-sm font-medium mb-1">Channel</label>
              <select
                className="w-full border rounded px-2 py-2"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              >
                <option value="">Select a channel…</option>
                {channels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={saveTarget}
            disabled={!guildId || !channelId || loading}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {msg && <p className="text-sm mt-4">{msg}</p>}
      
      <div className="mt-6 text-center">
        <a 
          href="/clubform" 
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Club Form
        </a>
      </div>
    </main>
  );
}