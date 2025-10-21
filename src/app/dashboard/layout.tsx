
import React from "react";
import DashboardHero from "./components/Hero/DashboardHero";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = {
    name: "John Doe",
    isClub: true,
    interests: [
      "Art",
      "Business",
      "STEM",
      "Sports",
      "Music",
      "Dance",
      "Theater",
      "Film",
      "Literature",
      "Writing",
      "Photography",
    ], // 12 interests
  };

  return (
    <div>
      <DashboardHero />
      {children}
    </div>
  );
}

export default DashboardLayout;
