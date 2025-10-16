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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4 capitalize">
          {type} Registration
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border w-full p-2 rounded"
          required
        />
        {type === "club" && (
          <input
            type="text"
            placeholder="Club Name"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            className="border w-full p-2 rounded"
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Register
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link href="/login" className="underline text-purple-600">
            Login 
          </Link>
        </p>
      </form>
    </div>
  );
}
