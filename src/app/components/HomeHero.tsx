import React from "react";
import SearchBar from "../dashboard/components/Hero/components/SearchBar";
import RecommendationTags from "../dashboard/components/Hero/components/RecommendationTags";

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function HomeHero({ searchQuery, setSearchQuery }: HomeHeroProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 h-96 bg-gradient-to-b from-primary to-background">
      <h1 className="text-center text-3xl text-white md:text-5xl lg:text-6xl font-bold">
        Discover Clubs, Create
        <br />
        Connections, All in One Place.
      </h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <RecommendationTags tags={[]} />
    </div>
  );
}

export default HomeHero;
