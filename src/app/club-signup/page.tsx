"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClubSignupPage() {
  const [clubName, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Club Registered:", { clubName, email, password });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-white space-y-5"
      >
        <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
          Club Registration
        </h2>

        <input
          type="text"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 shadow-lg"
        >
          Register
        </button>

        <p className="text-center text-sm mt-3 text-gray-200">
          Already have an account?{" "}
          <Link href="/" className="underline text-blue-300 hover:text-blue-200">
            Back to Home
          </Link>
        </p>
      </form>
    </div>
  );
}
