import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import React from "react";
import { EventItem } from "@/app/lib/data";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, Edit, Sparkles, PartyPopper, Users, Trophy, Music, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditEventDialog from "./EditEventDialog";

// Extended EventItem to include status
interface ClubEventItem extends EventItem {
  status?: 'pending' | 'approved' | 'rejected';
}

interface ClubEventCardProps {
  event: ClubEventItem;
  onEventUpdated?: () => void;
}

function ClubEventCard({ event, onEventUpdated }: ClubEventCardProps) {
  // ISO date to Day, Mon dd, hh:mm AM/PM
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles", // force PST/PDT for display
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get status badge variant and text
  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return { variant: 'default' as const, text: 'Approved', className: 'bg-green-500 hover:bg-green-600' };
      case 'rejected':
        return { variant: 'destructive' as const, text: 'Rejected', className: '' };
      case 'pending':
      default:
        return { variant: 'secondary' as const, text: 'Pending', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' };
    }
  };

  // Get a fun icon based on event ID for consistency
  const getFunIcon = (eventId: string) => {
    const icons = [Sparkles, PartyPopper, Users, Trophy, Music, Coffee];
    const index = eventId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % icons.length;
    const IconComponent = icons[index];
    return <IconComponent className="h-16 w-16 text-muted-foreground/40" />;
  };

  const statusBadge = getStatusBadge(event.status);

  return (
    <Card className="w-min hover:brightness-95 cursor-pointer hover:shadow-lg transition-all duration-200">
      <CardTitle className="px-4 flex items-center justify-between">
        <h1>{event.club}</h1>
        <Badge 
          variant={statusBadge.variant} 
          className={statusBadge.className}
        >
          {statusBadge.text}
        </Badge>
      </CardTitle>
      <CardContent className="px-0">
        <div className="h-[200px] w-[300px] bg-muted/30 flex items-center justify-center rounded-md">
          {getFunIcon(event.id)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-1 flex-col justify-between gap-2 items-start">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold">{event.title}</h2>
          <EditEventDialog event={event} onEventUpdated={onEventUpdated} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 min-h-4 min-w-4" />
            <p className="text-sm">{formatDate(event.start)}</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 min-h-4 min-w-4" />
            <p className="text-sm">{event.location || "N/A"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {event.tags?.slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-2 py-1 text-xs bg-accent text-accent-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ClubEventCard;
