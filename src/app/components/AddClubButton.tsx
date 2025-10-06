"use client";
import { useRouter } from "next/navigation";

export default function AddClubButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/clubform")}
      className="px-4 py-2 border rounded hover:bg-amber-950 hover:text-white"
    >
      Add Club Event
    </button>
  );
}