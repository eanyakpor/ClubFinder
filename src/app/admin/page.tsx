"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminModeration() {
  if (process.env.NEXT_PUBLIC_APP_MODE === "preview")
  {
    return null;
  }
    
  const [rows, setRows] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

async function load() {
  const res = await fetch("/api/moderation", { cache: "no-store" });
  if (!res.ok) { 
    console.error("GET /api/moderation failed:", await res.text());
    return; 
  }
  setRows(await res.json());
}

  async function act(id: string, action: "approve" | "reject") {
    setBusy(id + action);
    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Request failed");
      }
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-md p-6 text-black">
      <h1 className="text-2xl font-bold">Pending Events</h1>
      {rows.map((r) => (
        <div key={r.id} className="rounded border p-4">
          <div className="font-medium">{r.title}</div>
          <div className="text-sm text-gray-600">
            {r.club_name ?? "—"} • {new Date(r.start_time).toLocaleString()}
          </div>
          {r.location && <div className="text-sm">{r.location}</div>}
          {r.description && <p className="mt-2 text-sm">{r.description}</p>}
          <div className="mt-3 flex gap-2">
            <button
              disabled={!!busy}
              onClick={() => act(r.id, "reject")}
              className="rounded border px-3 py-1"
            >
              {busy === r.id + "reject" ? "…" : "Reject"}
            </button>
            <button
              disabled={!!busy}
              onClick={() => act(r.id, "approve")}
              className="rounded bg-black px-3 py-1 text-white"
            >
              {busy === r.id + "approve" ? "…" : "Approve"}
            </button>
          </div>
        </div>
      ))}
      {rows.length === 0 && <p>No pending events.</p>}
    </main>
  );
}