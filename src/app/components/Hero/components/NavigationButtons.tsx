"use client";

import React from "react";
import { Button } from "@/components/ui/button";

function NavigationButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">Analytics</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">View Events</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">Edit Club Info</Button>
    </div>
  );
}

export default NavigationButtons;