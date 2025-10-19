"use client";

import React from "react";
import { Search } from "lucide-react";

function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex justify-around items-center gap-2 px-10 py-2 bg-card border-[1px] border-border rounded-full shadow-md">
      <input
        type="text"
        placeholder="Search"
        className="outline-none w-[600px] placeholder:text-neutral-500 }"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="flex items-center justify-center p-2 rounded-full hover:bg-accent ">
        <Search className="text-muted-foreground" size={24}/>
      </button>
    </div>
  );
}

export default SearchBar;
