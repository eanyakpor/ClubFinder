"use client";

export default function VideoBackground() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover z-0 brightness-[0.5]"
    >
      <source
        src="https://live-csu-northridge.pantheonsite.io/sites/default/files/2025-09/Generic%20Webpage%20Final%20New%20Bitrate.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
}
