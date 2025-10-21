// app/api/discord/save-target/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role on the server to avoid RLS blocking the update
function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const { clubId, guildId, channelId } = await req.json();
  if (!clubId || !guildId || !channelId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  try {
    const sb = supabaseAdmin();

    // Validate club exists and belongs to authenticated user
    const { data: club, error: fetchErr } = await sb
      .from("clubs")
      .select("id, owner_user_id")
      .eq("id", clubId)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!club) return NextResponse.json({ error: "club_not_found" }, { status: 404 });

    // Get user from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !user) {
      return NextResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    // Verify user owns this club
    if (club.owner_user_id !== user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const { error } = await sb
      .from("clubs")
      .update({ discord_guild_id: guildId, discord_channel_id: channelId })
      .eq("id", clubId);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "update_failed" }, { status: 400 });
  }
}
