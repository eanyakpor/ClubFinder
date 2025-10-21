

import { SectionCards } from "./components/overview/section-cards";
import InterestTrends from "./components/activity_and_trends/InterestTrends";
import ReachvsEngagement from "./components/activity_and_trends/ReachvsEngagement";
import EngagementByPlatform from "./components/activity_and_trends/EngagementByPlatform";
import EventPerformance from "./components/activity_and_trends/EventPerformance";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h1 className="text-2xl font-semibold text-start px-10 lg:px-20">
              This Month's Overview
            </h1>
            <SectionCards />
            <h1 className="text-2xl font-semibold text-start px-10 lg:px-20">
              Activity & Trends
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 lg:px-20">
              <InterestTrends />
              <EventPerformance />
              <ReachvsEngagement />
              <EngagementByPlatform />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
