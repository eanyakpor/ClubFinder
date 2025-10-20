"use client";

import React from "react";
import NavigationButtons from "./components/NavigationButtons";

function DashboardHero() {

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 h-96">
      <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold">
        Your Hub For Events,
        <br />
        Analytics, and Growth.
      </h1>
      <NavigationButtons
      />
    </div>
  );
}

export default DashboardHero;
