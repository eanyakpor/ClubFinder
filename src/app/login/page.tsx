"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "student" | "club";
type Mode = "signin" | "signup";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [mode, setMode] = useState<Mode>("signup"); // default to signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function afterAuthRedirect() {
    // fetch the logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // save/override role in profiles (self-declared MVP)
    await supabase.from("profiles").upsert({ user_id: user.id, role });

    // route by role
    if (role === "club") window.location.href = "/onboarding/club";
    else window.location.href = "/";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          // if you’ve enabled email confirmations, you’ll get a "check your email" flow
          options: { emailRedirectTo: `${window.location.origin}/login` }
        });
        if (error) throw error;

        // If email confirmations are ON, there's often no session yet:
        if (!data.session) {
          setMsg("Check your email to confirm your account, then log in.");
          return;
        }
        await afterAuthRedirect();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMsg("Login failed. Please try again.");
          return;
        }
        await afterAuthRedirect();
      }
    } catch (err: any) {
      setMsg(err?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold">Welcome</h1>
        <p className="mb-4 text-sm text-gray-600">
          Choose your role and {mode === "signup" ? "create an account" : "log in"}.
        </p>

        {/* Role picker */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`rounded border px-3 py-2 text-sm ${role === "student" ? "border-black" : "border-gray-300"}`}
          >
            I’m a Student
          </button>
          <button
            type="button"
            onClick={() => setRole("club")}
            className={`rounded border px-3 py-2 text-sm ${role === "club" ? "border-black" : "border-gray-300"}`}
          >
            I represent a Club
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mb-3 text-sm">
          <span className="text-gray-600">
            {mode === "signup" ? "Already have an account?" : "New here?"}
          </span>{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-medium text-black underline"
          >
            {mode === "signup" ? "Log in" : "Create one"}
          </button>
        </div>

        {/* Email/password form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded bg-black py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
          </button>

          {msg && (
            <p className={`text-sm ${msg.includes("Check your email") ? "text-blue-600" : "text-red-600"}`}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}