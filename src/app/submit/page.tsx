"use client";
import { useState } from "react";

export default function Submit() {
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", type: "organization",
    pitch: "", weekday: "", time_range: "", location: "",
    instagram: "", discord: "", website: "", submitter_email: ""
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if club exists (create vs update)
    const existsRes = await fetch(`/api/clubs/exists?name=${encodeURIComponent(form.name)}`);
    const { exists, club_id } = await existsRes.json();

    const payload = {
      action: exists ? "update" : "create",
      target_club_id: exists ? club_id : undefined,
      submitter_email: form.submitter_email || undefined,
      payload: {
        club: {
          name: form.name,
          type: form.type as "sports" | "organization",
          pitch: form.pitch || null,
          instagram: form.instagram || null,
          discord: form.discord || null,
          website: form.website || null,
        },
        meetings: form.weekday && form.time_range && form.location
          ? [{ weekday: form.weekday, time_range: form.time_range, location: form.location }]
          : undefined
      }
    };

    const res = await fetch("/api/change-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMsg(res.ok ? "Submitted! We’ll review and publish soon." : "Error submitting. Try again.");
  };

  const on = (k: string) => (e: any) => setForm(s => ({ ...s, [k]: e.target.value }));

  return (
    <div className="text-black mx-auto max-w-lg">
      <h2 className="text-black text-2xl font-bold">Submit or Update Club Info</h2>
      <p className="mb-4 text-sm text-black">We’ll review before it appears on the homepage.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border p-2" placeholder="Club name *" value={form.name} onChange={on("name")} />
        <select className="w-full rounded border p-2" value={form.type} onChange={on("type")}>
          <option value="organization">organization</option>
          <option value="sports">sports</option>
        </select>
        <input className="w-full rounded border p-2" placeholder="Pitch (1–2 sentences)" value={form.pitch} onChange={on("pitch")} />
        <div className="grid grid-cols-3 gap-2">
          <input className="rounded border p-2" placeholder="Weekday" value={form.weekday} onChange={on("weekday")}/>
          <input className="rounded border p-2" placeholder="Time (e.g. 6–7pm)" value={form.time_range} onChange={on("time_range")}/>
          <input className="rounded border p-2" placeholder="Location" value={form.location} onChange={on("location")}/>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input className="rounded border p-2" placeholder="Instagram URL" value={form.instagram} onChange={on("instagram")}/>
          <input className="rounded border p-2" placeholder="Discord URL" value={form.discord} onChange={on("discord")}/>
          <input className="rounded border p-2" placeholder="Website URL" value={form.website} onChange={on("website")}/>
        </div>
        <input className="w-full rounded border p-2" placeholder="Your email (for follow-up)" value={form.submitter_email} onChange={on("submitter_email")} />
        <button className="rounded bg-black px-4 py-2 text-white">Submit</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}