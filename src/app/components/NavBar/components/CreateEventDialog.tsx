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
}

export default function CreateEventDialog({ isClub }: CreateEventDialogProps) {
  const [open, setOpen] = React.useState(false);

  if (!isClub) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground text-xs rounded-full">
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
  );
}
