import React from "react";
import SearchBar from "./components/SearchBar";
import RecommendationTags from "./components/RecommendationTags";
import NavigationButtons from "./components/NavigationButtons";

function Hero({ user }: { user: { name: string; isClub: boolean; interests: string[] } }) {
  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 h-96">
      {user.isClub ? (
        <>
        <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold">
          Your Hub For Events,
          <br />
          Analytics, and Growth.
        </h1>
        <NavigationButtons />
        </>
      ) : (
        <>
          <h1 className="text-center text-3xl md:text-5xl lg:text-6xl font-bold">
            Discover Clubs, Create
            <br />
            Connections, All in One Place.
          </h1>
          <SearchBar />
          <RecommendationTags tags={user.interests}/>
        </>
      )}
    </div>
  );
}

export default Hero;
