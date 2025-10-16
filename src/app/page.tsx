import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center space-y-8 bg-black/40 p-10 rounded-3xl shadow-2xl backdrop-blur-sm">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
        Project X
      </h1>

      <p className="text-lg text-gray-200">
        Find clubs, events, or skills — one search away.
      </p>

      <div className="flex gap-6 justify-center">
        <Link
          href="/student-signup"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 transition shadow-lg font-medium"
        >
          Student
        </Link>
        <Link
          href="/club-signup"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 transition shadow-lg font-medium"
        >
          Club
        </Link>
      </div>
    </div>
  );
}
