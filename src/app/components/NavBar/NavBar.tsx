"use client";

import React from "react";
import { Alexandria } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

const alexandria = Alexandria({ subsets: ["latin"] });

function NavBar() {
  const [isClub, setIsClub] = React.useState(true); // If club account is true, show add club event button

  return (
    <div className="sticky top-0 z-50 bg-background h-14 flex items-center justify-between px-8 border-b-[1px] border-neutral-200">
      <Link href="/">
        <h1 className={alexandria.className}>PROJECT X</h1>
      </Link>
      <nav className="flex justify-between items-center gap-2">
        <Button variant={"ghost"} className="text-primary text-xs">
          <Lock />
          Login
        </Button>
        <Button
          className={`bg-primary text-primary-foreground text-xs rounded-full ${
            !isClub ? "hidden" : ""
          }`}
        >
          Add Club Event
        </Button>
      </nav>
    </div>
  );
}

export default NavBar;
