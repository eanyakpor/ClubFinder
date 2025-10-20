const DISCORD_INVITE_LINK = 
`https://discord.com/api/oauth2/authorize?client_id=1428296962255491072&permissions=0&scope=bot`;
export default function connectToDiscordButton()  {
    return (
        <a href={DISCORD_INVITE_LINK} className="px-4 py-2 rounded bg-[#5865F2] text-white">
            Connect to Discord</a>
    );
}