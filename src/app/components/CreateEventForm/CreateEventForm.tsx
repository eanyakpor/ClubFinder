"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import DateAndTimeInput from "./components/DateAndTimeInput";
import RepeatUntilInput from "./components/repeatUntilInput";

function CreateEventForm() {
  const [name, setName] = React.useState<string>("");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [repeatUntil, setRepeatUntil] = React.useState<Date | undefined>(
    undefined
  );
  const [location, setLocation] = React.useState<string>("");
  const [picture, setPicture] = React.useState<File | null>(null);
  const [filters, setFilters] = React.useState<string[]>([]);
  const [newFilter, setNewFilter] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const addFilter = () => {
    // Check if the filter already exists
    const formattedFilter =
      newFilter.charAt(0).toUpperCase() + newFilter.slice(1);

    
    if (filters.includes(formattedFilter)) {
      setErrorMessage("Filter already exists");
      return;
    }

    if (newFilter === "") {
      setErrorMessage("Filter cannot be empty");
      return;
    }

    // Format first character to uppercase
    // Add the filter
    setFilters([...filters, formattedFilter]);
    setNewFilter("");
    setErrorMessage("");
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Event Name */}
      <Label>
        Event Name <span className="text-red-500">*</span>
      </Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      {/* Date and Time */}
      <DateAndTimeInput date={date} setDate={setDate} />
      {/* Repeat Until */}
      <Label>
        Repeat Until{" "}
        <span className="text-muted-foreground">{"(Optional)"}</span>
      </Label>
      <RepeatUntilInput
        repeatUntil={repeatUntil}
        setRepeatUntil={setRepeatUntil}
      />
      {/* Location */}
      <Label>
        Location <span className="text-muted-foreground">{"(Optional)"}</span>
      </Label>
      <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      {/* Insert Image */}
      <Label>
        Insert Image{" "}
        <span className="text-muted-foreground">{"(Optional)"}</span>
      </Label>
      <Input
        id="picture"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type.startsWith("image/")) {
            setPicture(file);
          } else if (file) {
            // Reset the input if non-image file is selected
            e.target.value = "";
            setErrorMessage(
              "Please select an image file (PNG, JPG, GIF, etc.)"
            );
            setPicture(null);
          } else {
            setPicture(null);
          }
        }}
        className="cursor-pointer"
      />
      {/* Event Filters */}
      <Label>Event Filters</Label>
      {/* Filter List */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter, index) => (
          <Button
            key={"filter-" + index}
            onClick={() => removeFilter(filter)}
            className="mr-2"
          >
            {filter}
          </Button>
        ))}
      </div>
      {/* Add Filter */}
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Sports, Music, Tech"
          value={newFilter}
          onChange={(e) => setNewFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addFilter();
            }
          }}
        />
        <Button onClick={addFilter}>Add Filter</Button>
      </div>
      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default CreateEventForm;
