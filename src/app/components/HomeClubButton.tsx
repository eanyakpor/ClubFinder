"use client";
import { useRouter } from "next/navigation";

export default function HomeClubButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="text-lg font-semibold hover:underline"
    >
      CSUN Club Finder
    </button>
  );
}