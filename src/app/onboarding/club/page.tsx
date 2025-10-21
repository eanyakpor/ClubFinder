"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../../components/AuthProvider";

export default function ClubOnboardingPage() {
  const { user, profile, loading, refreshClubStatus } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  // Redirect if not authenticated or not a club
  if (!loading && (!user || (profile && profile.profile_type !== 'club'))) {
    router.push('/');
    return null;
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  const [form, set] = useState({ name: "", email: "", instagram: "", discord: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    set((prev) => ({ ...prev, [key]: value }));
  }

  async function applyPendingDiscordConfig(clubId: string) {
    try {
      const pendingConfig = localStorage.getItem('pendingDiscordConfig');
      if (!pendingConfig) return;

      const config = JSON.parse(pendingConfig);
      const { guildId, channelId } = config;

      if (!guildId || !channelId) return;

      // Get the current Supabase session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.access_token) {
        console.error('No session for Discord config save');
        return;
      }

      // Save Discord configuration
      const r = await fetch("/api/discord/save-target", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ clubId, guildId, channelId }),
      });

      if (r.ok) {
        console.log('Discord configuration applied successfully');
        // Clear the pending config
        localStorage.removeItem('pendingDiscordConfig');
      } else {
        console.error('Failed to apply Discord configuration');
      }
    } catch (error) {
      console.error('Error applying pending Discord config:', error);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // 1) Must be logged in
    if (!user) {
      setMessage("You must be logged in.");
      setSubmitting(false);
      return;
    }

    // 2) Basic validation
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      setMessage("Club name and official email are required.");
      setSubmitting(false);
      return;
    }

    try {
      // 3) Upsert to avoid unique(owner_user_id) conflicts on re-submit
      //    Include any NOT NULL columns from your schema (e.g., type / is_active) if required.
      const { data: upserted, error: upsertErr } = await supabase
        .from("clubs")
        .upsert(
          {
            owner_user_id: user.id,
            name,
            type: "organization", // Default to organization for now
            email,
            instagram_url: form.instagram.trim() || null,
            discord_invite: form.discord.trim() || null,
            website_url: form.website.trim() || null,
            // Optional fields you might add later:
            // pitch: null,
            // contact_email: null,
            // is_active: true, // has default true already
          },
          { onConflict: "owner_user_id" }
        )
        .select("id")
        .single();

      if (upsertErr) {
        console.error("clubs upsert error:", upsertErr);
        setMessage(upsertErr.message || "Error saving club info. Please try again.");
        setSubmitting(false);
        return;
      }

      if (!upserted?.id) {
        setMessage("Could not get Club ID after save.");
        setSubmitting(false);
        return;
      }

      const clubId = upserted.id as string;
      console.log('Club created successfully with ID:', clubId);
      
      // Check for pending Discord configuration and apply it
      await applyPendingDiscordConfig(clubId);
      
      // Refresh club status in AuthProvider
      await refreshClubStatus();
      
      // Redirect to home page - the AuthProvider will detect the new club
      router.push('/');
    } catch (err: any) {
      console.error("onboarding save error:", err);
      setMessage("Error saving club info. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 text-black">
      <h1 className="text-2xl font-bold mb-3">Club Onboarding</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded border px-3 py-2" placeholder="Club name *"
               value={form.name} onChange={(e)=>onChange("name", e.target.value)} />
        
        <input className="w-full rounded border px-3 py-2" placeholder="Official club email *"
               type="email" value={form.email} onChange={(e)=>onChange("email", e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Instagram URL (optional)"
               value={form.instagram} onChange={(e)=>onChange("instagram", e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Discord invite (optional)"
               value={form.discord} onChange={(e)=>onChange("discord", e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Website URL (optional)"
               value={form.website} onChange={(e)=>onChange("website", e.target.value)} />
        <button disabled={submitting}
          className="w-full rounded bg-black text-white py-2 hover:opacity-90 disabled:opacity-60">
          {submitting ? "Saving…" : "Save & Continue"}
        </button>
        {message && <p className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
      </form>
    </main>
  );
}