"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBarLogo from "./components/NavBarLogo";
import LoginButton from "./components/LoginButton";
import CreateEventDialog from "./components/CreateEventDialog";
import UserDropdown from "./components/UserDropdown";
import { useAuth } from "../AuthProvider";

function NavBar() {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Hide CreateEvent button during onboarding flows
  const isOnboardingRoute = pathname?.startsWith('/onboarding') || pathname === '/role';

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 h-14 flex items-center justify-between px-8 transition-colors duration-200 ${
      isScrolled ? 'bg-background border-b-[1px] border-b-border shadow-sm' : 'bg-primary'
    }`}>
      <NavBarLogo isScrolled={isScrolled}/>
      <nav className="flex justify-between items-center gap-2">
        {loading ? (
          <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
        ) : !user && pathname !== '/login' ? (
          <LoginButton />
        ) : (
          <>
            {!isOnboardingRoute && <CreateEventDialog isScrolled={isScrolled} isClub={profile?.profile_type === 'club'} />}
            <UserDropdown user={user} />
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
