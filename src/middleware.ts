import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // --- Preview guard: block writes in PR previews ---
  const isPreview = process.env.VERCEL_ENV === "preview";
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method.toUpperCase());

  if (isPreview && isWriteMethod) {
    // Optionally allow certain internal endpoints to still work:
    // const isSafeEndpoint = pathname.startsWith("/api/health");
    // if (!isSafeEndpoint) {
    return new NextResponse("Writes disabled in Preview", { status: 403 });
    // }
  }
  const pathname = req.nextUrl.pathname;
  
  // ALWAYS log - this should show for EVERY request
  console.log("🔒 Middleware executing for:", pathname);

  // Check if this is an admin route
  const isAdminRoute = pathname.startsWith("/admin");
  const isModerationAPI = pathname.startsWith("/api/moderation");

  if (!isAdminRoute && !isModerationAPI) {
    // console.log("✅ Not a protected route");
    return NextResponse.next();
  }

  console.log("🛡️ Protected route detected!");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Check for environment variable
  const expectedPass = process.env.ADMIN_BASIC_PASS;
  if (!expectedPass) {
    // console.error("❌ ADMIN_BASIC_PASS not set in .env.local!");
    return new NextResponse("Server configuration error - check logs", { status: 500 });
  }

  console.log("🔑 Expected password is set");

  // Get Authorization header
  const auth = req.headers.get("authorization");
  console.log("📋 Auth header:", auth ? `Present: ${auth.substring(0, 20)}...` : "Missing");

  if (auth?.startsWith("Basic ")) {
    const b64 = auth.slice(6);
    try {
      const decoded = atob(b64);
      const [, ...passParts] = decoded.split(":");
      const password = passParts.join(":");
      
      console.log("🔍 Comparing passwords...");
      if (password === expectedPass) {
        console.log("✅ Password matches! Allowing access");
        return NextResponse.next();
      } else {
        console.log("❌ Password does NOT match");
      }
    } catch (error) {
      console.error("❌ Failed to decode auth:", error);
    }
  } else {
    console.log("❌ No Basic auth header found");
  }

  // Return 401 with Basic Auth challenge
  // console.log("🚫 Sending 401 with auth challenge");
  return new NextResponse("Unauthorized - Admin Access Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
    },
  });
}

// Try WITHOUT a matcher - this will run on ALL routes
// We'll filter inside the function instead
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};