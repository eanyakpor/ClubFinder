/*
  Role picker page lets a signed-in user choose "student" or "club".
  Updates/creates their profile row with the chosen role
  Redirects clubs to /onboarding/club, students to /
*/
"use client";

import { useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

type Role = "student" | "club";

const supabase = getSupabaseClient();

export default function RolePage() {

  // flag to tells what role the user may be 
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function chooseRole(role: Role) {
    setBusy(true);
    setMsg(null);

    // Ensure user is logged in
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      setMsg(userErr.message ?? "Authentication error. Please try logging in again.");
      setBusy(false);
      return;
    }
    if (!user) {
      setMsg("You must be logged in to choose a role.");
      setBusy(false);
      // Optional: send to your login page
      // window.location.href = "/loginBefore";
      return;
    }

    /*
        Assign role to the user after they pick whether their a student or club
        When inserting into profiles, 
        if a row already exists with the same user_id (i.e., it hits a unique or 
        primary key constraint on user_id), update that row instead of throwing a duplicate-key error.
    */
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, role }, { onConflict: "user_id" });

    if (upsertErr) {
      setMsg(upsertErr.message ?? "Could not save your role. Please try again.");
      setBusy(false);
      return;
    }

    // Redirect by role
    if (role === "club") {
      window.location.href = "/onboarding/club";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold">Choose your account type</h1>
        <p className="mb-6 text-sm text-gray-600">
          Pick the option that best describes you.
        </p>

        <div className="grid gap-3">
          <button
            disabled={busy}
            onClick={() => chooseRole("student")}
            className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            I’m a Student
          </button>

          <button
            disabled={busy}
            onClick={() => chooseRole("club")}
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            I represent a Club
          </button>
        </div>

        {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
      </div>
    </main>
  );
}