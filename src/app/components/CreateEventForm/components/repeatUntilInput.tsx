import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";

function repeatUntilInput({
  repeatUntil,
  setRepeatUntil,
}: {
  repeatUntil: Date | undefined;
  setRepeatUntil: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker"
          className={`w-32 justify-between font-normal ${
            repeatUntil ? "" : "text-muted-foreground"
          }`}
        >
          {repeatUntil ? repeatUntil.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={repeatUntil}
          captionLayout="dropdown"
          onSelect={(date) => {
            setRepeatUntil(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default repeatUntilInput;
