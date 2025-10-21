"use client";
import React from "react";
import NavBarLogo from "./components/NavBarLogo";
import LoginButton from "./components/LoginButton";
import CreateEventDialog from "./components/CreateEventDialog";
import UserDropdown from "./components/UserDropdown";
import { useAuth } from "../AuthProvider";

function NavBar() {
  const { user, loading } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-8">
      <NavBarLogo />
      <nav className="flex justify-between items-center gap-2">
        {loading ? (
          <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
        ) : !user ? (
          <LoginButton />
        ) : (
          <>
            <CreateEventDialog isClub={user.user_metadata.club ? true : false} />
            <UserDropdown user={user} />
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
