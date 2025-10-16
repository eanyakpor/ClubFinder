"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/30 
                   shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-white space-y-5 relative z-10"
      >
        <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
          Login
        </h2>

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

        <button
          type="submit"
          className="w-full py-3 mt-3 rounded-xl font-semibold 
                     bg-gradient-to-r from-purple-500 to-blue-500
                     hover:from-purple-400 hover:to-blue-400
                     shadow-lg transition-all duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm mt-3 text-gray-200">
          Don’t have an account?{" "}
          <Link
            href="/register?type=student"
            className="underline text-purple-300 hover:text-purple-200 transition"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
