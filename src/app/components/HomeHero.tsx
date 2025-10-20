import React from "react";
import SearchBar from "../dashboard/components/Hero/components/SearchBar";
import RecommendationTags from "../dashboard/components/Hero/components/RecommendationTags";

function HomeHero({ user }: { user: { name: string; interests: string[] } }) {
  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 h-96">
      <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold">
        Discover Clubs, Create
        <br />
        Connections, All in One Place.
      </h1>
      <SearchBar />
      <RecommendationTags tags={user.interests} />
    </div>
  );
}

export default HomeHero;
