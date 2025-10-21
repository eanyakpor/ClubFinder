/*
  Server actions for secure authentication
  
  SECURITY: These actions run on the server and don't expose Supabase client to browser
*/

"use server";

// import { validateUserSession } from "./supabase-server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export async function getCurrentUser() {
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("sb-access-token")?.value;

//     if (!accessToken) {
//       return null;
//     }

//     return await validateUserSession(accessToken);
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     return null;
//   }
// }

export async function signOut() {
  try {
    const cookieStore = await cookies();

    // Clear auth cookies
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");

    redirect("/");
  } catch (error) {
    console.error("Error signing out:", error);
    return { error: "Failed to sign out" };
  }
}
