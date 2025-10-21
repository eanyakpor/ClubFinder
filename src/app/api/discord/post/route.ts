// app/api/discord/post/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function fmtEvent(body: any) {
  const start = body.start_time ? new Date(body.start_time) : null;
  const when = start ? `📅 ${start.toLocaleString()}` : "";
  const lines = [
    `**${body.title || "New Event"}**`,
    body.description ? `\n${body.description}` : "",
    body.location ? `\n📍 ${body.location}` : "",
    when ? `\n${when}` : "",
  ];
  return lines.join("");
}

export async function POST(req: Request) {
  const payload = await req.json(); // { clubId, title, description, location, start_time }
  const { clubId } = payload;
  if (!clubId) return NextResponse.json({ error: "clubId required" }, { status: 400 });

  const { data: club, error } = await supabase
    .from("clubs")
    .select("discord_channel_id")
    .eq("id", clubId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!club?.discord_channel_id) {
    return NextResponse.json({ error: "No Discord channel configured" }, { status: 400 });
  }

  const content = fmtEvent(payload);
  const r = await fetch(`https://discord.com/api/v10/channels/${club.discord_channel_id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const data = await r.json();
  if (!r.ok) return NextResponse.json({ error: data?.message || "post_failed" }, { status: r.status });

  return NextResponse.json({ ok: true, messageId: data.id });
}