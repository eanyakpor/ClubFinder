"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getSupabaseClient } from "@/app/lib/supabaseServer";
import { User } from "@supabase/supabase-js";

interface UserDropdownProps {
  user: {
    name: string;
    isClub: boolean;
  };
}

export default function UserDropdown({ user }: { user: User | null }) {
  const supabase = getSupabaseClient();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.user_metadata.picture} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.user_metadata.name[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm text-muted-foreground">
            {user?.user_metadata.club ? "Club " : ""}Name
          </p>
          <p>{user?.user_metadata.name}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/">View Events</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/dashboard/analytics">View Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/dashboard/club-info">Edit Club Info</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
