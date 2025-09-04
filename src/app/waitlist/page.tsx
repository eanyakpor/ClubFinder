"use client";
import { useState } from "react";

export default function Waitlist() {
  const [form, setForm] = useState({ email: "", name: "", hp: "" });
  const [status, setStatus] = useState<"idle"|"ok"|"err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/waitlist" + window.location.search, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  return (
    <main className="text-black mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Join the CSUN Club Finder Waitlist</h1>
      <p className="text-sm text-black text-center">We’ll email you when we launch. No spam.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
            className="hidden"
            value={form.hp}
            onChange={e => setForm(s => ({ ...s, hp: e.target.value }))}
            disabled={status === "ok"}
        />
        <input
            className="w-full rounded border p-3"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
            disabled={status === "ok"}
        />
        <input
            className="w-full rounded border p-3"
            placeholder="Name (optional)"
            value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
            disabled={status === "ok"}
        />
        <button
            className="w-full rounded bg-[#CC0000] px-4 py-3 font-medium text-white hover:brightness-90 disabled:opacity-50"
            disabled={status === "ok"}
        >
            {status === "ok" ? "✔ Joined" : "Join Waitlist"}
        </button>

        {status === "ok" && (
            <p className="text-center text-green-600 text-sm">You’re on the list! 🎉</p>
        )}
        {status === "err" && (
            <p className="text-center text-red-600 text-sm">Something went wrong. Try again.</p>
        )}
        </form>
    </main>
  );
}