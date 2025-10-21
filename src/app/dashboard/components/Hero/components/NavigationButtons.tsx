import React from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

function NavigationButtons() {
  const pathname = usePathname();

  const handleSelectPage = (page: string) => {
    if (page === "analytics") {
      redirect("/dashboard/analytics");
    } else if (page === "club-events") {
      redirect("/dashboard/club-events");
    } else if (page === "club-info") {
      redirect("/dashboard/club-info");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
      <Button
        variant={"outline"}
        className={`bg-card text-card-foreground ${
          pathname.includes("/dashboard/analytics")
            ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            : ""
        } w-52`}
        onClick={() => handleSelectPage("analytics")}
      >
        Analytics
      </Button>
      <Button
        variant={"outline"}
        className={`bg-card text-card-foreground ${
          pathname.includes("/dashboard/club-events")
            ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            : ""
        } w-52`}
        onClick={() => handleSelectPage("club-events")}
      >
        View Club Events
      </Button>
      <Button
        variant={"outline"}
        className={`bg-card text-card-foreground ${
          pathname.includes("/dashboard/club-info")
            ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
            : ""
        } w-52`}
        onClick={() => handleSelectPage("club-info")}
      >
        Edit Club Info
      </Button>
    </div>
  );
}

export default NavigationButtons;
