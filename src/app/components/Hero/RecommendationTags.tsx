"use client";

import React from "react";
import { Button } from "@/components/ui/button";

function RecommendationTags() {
  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} className="bg-card text-card-foreground">Art</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground">Business</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground">STEM</Button>
      <Button variant={"outline"} className="bg-card text-card-foreground">Sports</Button>
    </div>
  );
}

export default RecommendationTags;