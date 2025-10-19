"use client";

import React from "react";
import { Button } from "@/components/ui/button";

function NavigationButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">View Events</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">Club Info</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground w-52">Analytics</Button>
    </div>
  );
}

export default NavigationButtons;