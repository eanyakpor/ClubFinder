"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateEventForm from "../../CreateEventForm/CreateEventForm";

interface CreateEventDialogProps {
  isClub: boolean;
  isScrolled: boolean;
}

export default function CreateEventDialog({ isClub, isScrolled }: CreateEventDialogProps) {
  const [open, setOpen] = React.useState(false);

  if (!isClub) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={'bg-primary text-primary-foreground text-xs rounded-full border-white/80 dark:bg-primary dark:border-none ' + (isScrolled ? 'hover:bg-primary/60 hover:text-primary-foreground' : '')}>
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 pb-6 flex flex-col w-[425px] sm:max-w-[425px] !max-h-[692px]">
        <DialogHeader>
          <DialogTitle className="p-6 pb-4">Create Event</DialogTitle>
        </DialogHeader>
        <CreateEventForm />
      </DialogContent>
    </Dialog>
  );
}
