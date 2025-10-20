import React from "react";
import NavBarLogo from "./components/NavBarLogo";
import LoginButton from "./components/LoginButton";
import CreateEventDialog from "./components/CreateEventDialog";
import UserDropdown from "./components/UserDropdown";
import { User } from "@supabase/supabase-js";

function NavBar({user}: {user: User | null}) {

  console.log("user", user);
  return (
    <header className="h-14 flex items-center justify-between px-8">
      <NavBarLogo />
      <nav className="flex justify-between items-center gap-2">
        {!user ? (
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
