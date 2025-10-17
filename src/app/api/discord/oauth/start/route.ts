import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state"); // clubId
  if (!state) {
    return NextResponse.json({ error: "Missing state (clubId)" }, { status: 400 });
  }

  const redirectUri = process.env.DISCORD_REDIRECT_URI!;
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const scopes = ["identify", "guilds"].join(" ");
  const authUrl = new URL("https://discord.com/api/oauth2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("state", state);

  // must return an absolute redirect
  return NextResponse.redirect(authUrl.toString());
}