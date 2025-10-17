"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ClubOnboardingPage() {
  const router = useRouter();
  const [form, set] = useState({ name: "", email: "", instagram: "", discord: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    set((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // 1) Must be logged in
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error("getUser error:", userErr);
      setMessage("Auth error. Please re-login.");
      setSubmitting(false);
      return;
    }
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
            type: "organization", // 🚨 REQUIRED by your schema (NOT NULL)
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

      // 4) Redirect straight into Discord OAuth (quick selector flow will follow)
      const oauthStart = `/api/discord/oauth/start?state=${encodeURIComponent(clubId)}`;
      window.location.href = oauthStart;
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