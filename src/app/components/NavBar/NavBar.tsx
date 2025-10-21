"use client";
import React from "react";
import { usePathname } from "next/navigation";
import NavBarLogo from "./components/NavBarLogo";
import LoginButton from "./components/LoginButton";
import CreateEventDialog from "./components/CreateEventDialog";
import UserDropdown from "./components/UserDropdown";
import { useAuth } from "../AuthProvider";

function NavBar() {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  
  // Hide CreateEvent button during onboarding flows
  const isOnboardingRoute = pathname?.startsWith('/onboarding') || pathname === '/role';

  return (
    <header className="h-14 flex items-center justify-between px-8">
      <NavBarLogo />
      <nav className="flex justify-between items-center gap-2">
        {loading ? (
          <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
        ) : !user && pathname !== '/login' ? (
          <LoginButton />
        ) : (
          <>
            {!isOnboardingRoute && <CreateEventDialog isClub={profile?.profile_type === 'club'} />}
            <UserDropdown user={user} />
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
