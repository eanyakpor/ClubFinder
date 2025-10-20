export default function AddDiscordIntegration({ clubId }: { clubId: string }) {
    return (
      <a
        href={`/api/discord/oauth/start?state=${clubId}`}
        className="px-4 py-2 rounded bg-[#5865F2] text-white"
      >
        Sign in with Discord
      </a>
    );
  }