"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "student" or "club"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [clubName, setClubName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registered:", { type, email, password, clubName });
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* 🎥 Fullscreen Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Generic%20Webpage%20Final%20New%20Bitrate.mp4"
          type="video/mp4"
        />
      </video>

      {/* 🧊 Frosted Glass Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[400px] p-8 rounded-3xl bg-white/10 
                   backdrop-blur-xl border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.4)] 
                   text-white space-y-5"
      >
        <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
          {type === "club" ? "Club Registration" : "Student Registration"}
        </h2>

        {type === "club" && (
          <input
            type="text"
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                     focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        {/* 🌈 Gradient Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold 
                     bg-gradient-to-r from-purple-500 to-blue-500
                     hover:from-purple-400 hover:to-blue-400
                     transition-all duration-300 shadow-lg"
        >
          Register
        </button>

        <p className="text-center text-sm mt-3 text-gray-200">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline text-purple-300 hover:text-purple-200 transition"
          >
            Login 
          </Link>
        </p>
      </form>
    </div>
  );
}
