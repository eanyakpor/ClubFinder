import React from "react";
import ClubEventsList from "./ClubEventsList";
import { getAllEventsData } from "@/lib/eventsServer";

export default async function ClubEventsPage() {
  const {upcoming, past, today} = await getAllEventsData();
  
  return (
    <ClubEventsList upcoming={upcoming} past={past} today={today} />
  );
}
