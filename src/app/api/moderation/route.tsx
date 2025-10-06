// src/app/api/moderation/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensure Node runtime for service role

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚠️ service role key (server-only)
  if (!url) throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}

// tiny helper so we don't need date-fns
function addWeeks(date: Date, weeks: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

// GET: list all pending events
export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("events")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    return new NextResponse(
      `GET /api/moderation error: ${e?.message || e}`,
      { status: 500 }
    );
  }
}

// POST: approve or reject event (with recurring support)
export async function POST(req: Request) {
  try {
    const { id, action } = (await req.json()) as {
      id?: string;
      action?: "approve" | "reject";
    };
    if (!id || !action) return new NextResponse("Bad request", { status: 400 });

    const sb = supabaseAdmin();
    const newStatus = action === "approve" ? "approved" : "rejected";

    // Fetch the original event
    const { data: ev, error: fetchErr } = await sb
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (fetchErr || !ev) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (newStatus === "approved" && ev.repeat_weekly) {
      const start = new Date(ev.start_time);
      const until = ev.repeat_until ? new Date(ev.repeat_until) : addWeeks(start, 12);

      // 1) Approve the original row (week 0)
      const { error: updErr } = await sb
        .from("events")
        .update({ status: "approved" })
        .eq("id", id);
      if (updErr) throw updErr;

      // 2) Insert FUTURE weekly occurrences (start at +1 week)
      const inserts: Array<Record<string, any>> = [];
      for (let d = addWeeks(start, 1); d <= until; d = addWeeks(d, 1)) {
        inserts.push({
          // ⚠️ Explicit fields ONLY (no spreading ev → avoids id=null)
          title: ev.title,
          club_name: ev.club_name,
          description: ev.description,
          location: ev.location,
          contact_email: ev.contact_email,
          image_url: ev.image_url,
          repeat_weekly: ev.repeat_weekly ?? false,
          repeat_until: ev.repeat_until ?? null,

          start_time: d.toISOString(),
          status: "approved",
        });
      }

      if (inserts.length) {
        const { error: insErr } = await sb.from("events").insert(inserts);
        if (insErr) throw insErr;
      }
    } else {
      // Single approval/rejection
      const { error: updErr } = await sb
        .from("events")
        .update({ status: newStatus })
        .eq("id", id);
      if (updErr) throw updErr;
    }

    return new NextResponse("OK", { status: 200 });
  } catch (e: any) {
    return new NextResponse(
      `POST /api/moderation error: ${e?.message || e}`,
      { status: 500 }
    );
  }
}