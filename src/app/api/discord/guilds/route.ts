// app/api/discord/guilds/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("accessToken");
  if (!accessToken) return NextResponse.json({ error: "missing accessToken" }, { status: 400 });

  const r = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  const guilds = await r.json();
  if (!r.ok) return NextResponse.json(guilds, { status: r.status });
  return NextResponse.json({ guilds });
}
