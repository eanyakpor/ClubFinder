import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = () =>
  createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

export async function POST(req: NextRequest) {
  const { email, name, hp } = await req.json();
  if (hp) return NextResponse.json({ ok: true });                // honeypot
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))       // basic check
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });

  const url = new URL(req.url);
  const ip = req.headers.get("x-forwarded-for") ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  const { error } = await sb().from("waitlist_signups").insert([{
    email: email.trim().toLowerCase(),
    name: name?.trim() || null,
    utm_source: url.searchParams.get("utm_source"),
    utm_medium: url.searchParams.get("utm_medium"),
    utm_campaign: url.searchParams.get("utm_campaign"),
    user_agent: ua,
    ip
  }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}