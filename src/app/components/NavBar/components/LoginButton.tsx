"use client"

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";

export default function LoginButton() {
  return (
    <Button variant={"default"} className="cursor-pointer" onClick={() => redirect("/login")}>
      <Lock />
      Login
    </Button>
  );
}
