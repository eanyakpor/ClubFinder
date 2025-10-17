// app/api/discord/channels/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guildId = searchParams.get("guildId");
  if (!guildId) return NextResponse.json({ error: "guildId required" }, { status: 400 });

  const r = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN!}` },
    cache: "no-store",
  });

  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: r.status });
  const channels = await r.json();
  const list = (channels || [])
    .filter((c: any) => c.type === 0 || c.type === 5) // 0=text, 5=news
    .map((c: any) => ({ id: c.id, name: c.name, type: c.type }));

  return NextResponse.json({ channels: list });
}
