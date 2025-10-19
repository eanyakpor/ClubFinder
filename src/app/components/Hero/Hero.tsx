import React from "react";
import SearchBar from "./SearchBar";
import RecommendationTags from "./RecommendationTags";
import NavigationButtons from "./NavigationButtons";

function Hero({ userType }: { userType: "student" | "club" }) {
  return (
    <div className="flex flex-col justify-center items-center gap-8 p-8 h-96">
      {userType === "club" ? (
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
          <RecommendationTags />
        </>
      )}
    </div>
  );
}

export default Hero;
