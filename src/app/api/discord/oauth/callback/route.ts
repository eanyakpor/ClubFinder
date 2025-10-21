// app/api/discord/oauth/callback/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code  = url.searchParams.get("code");
  const encodedState = url.searchParams.get("state") || "";
  
  // Decode the state parameter to get clubId and returnTo
  let clubId = "";
  let returnTo = "/clubform";
  
  try {
    const stateData = JSON.parse(Buffer.from(encodedState, 'base64').toString());
    clubId = stateData.clubId || "";
    returnTo = stateData.returnTo || "/clubform";
  } catch (error) {
    // Fallback for old format (just clubId)
    clubId = encodedState;
  }
  if (!code) {
    const u = new URL(`${returnTo}?err=missing_code`, new URL(req.url).origin);
    return NextResponse.redirect(u.toString());
  }

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI!,
  });

  const r = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const token = await r.json();
  if (!r.ok) {
    const detail = token?.error_description || "oauth_failed";
    const u = new URL(`${returnTo}?err=oauth&detail=${encodeURIComponent(detail)}`, new URL(req.url).origin);
    return NextResponse.redirect(u.toString());
  }

  // Return to the specified return_to URL with token + clubId
  const qs = new URLSearchParams({
    clubId: clubId,
    accessToken: token.access_token || "",
  });

  const u = new URL(`${returnTo}?${qs.toString()}`, new URL(req.url).origin);
  return NextResponse.redirect(u.toString());
}
