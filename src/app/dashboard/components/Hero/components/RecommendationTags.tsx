import React from "react";
import { Button } from "@/components/ui/button";

function RecommendationTags({ tags }: { tags: string[] }) {
  // 4 random tags
  const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="flex items-center gap-2">
      {randomTags.map((tag, index) => (
        <Button
          key={"tag-" + index}
          variant={"outline"}
          className="bg-card text-card-foreground"
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}

export default RecommendationTags;
