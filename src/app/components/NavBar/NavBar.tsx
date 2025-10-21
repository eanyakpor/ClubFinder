"use client";

import React from "react";
import { Alexandria } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateEventForm from "../CreateEventForm/CreateEventForm";

const alexandria = Alexandria({ subsets: ["latin"] });

function NavBar({ user }: { user: { name: string; isClub: boolean } }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-8">
      <Link href="/">
        <h1 className={alexandria.className}>PROJECT X</h1>
      </Link>
      <nav className="flex justify-between items-center gap-2">
        {!user ? (
          <Button variant={"ghost"} className="text-primary text-xs">
            <Lock />
            Login
          </Button>
        ) : (
          <>
            {/* Create Event */}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`bg-primary text-primary-foreground text-xs rounded-full ${
                    !user.isClub ? "hidden" : ""
                  }`}
                >
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[425px] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Event</DialogTitle>
                  
                </DialogHeader>
                <CreateEventForm />
              </DialogContent>
            </Dialog>
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm text-muted-foreground">
                    {user.isClub ? "Club " : ""}Name
                  </p>
                  <p>{user.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  View Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  View Events
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Edit Club Info
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
