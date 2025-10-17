import { SectionCards } from "./components/section-cards";
import RSVPTrends from './components/RSVPTrends'
import ReachvsEngagementChart from './components/ReachvsEngagementChart'

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-semibold text-center">This Month's Overview</h1>
          <SectionCards />
          <h1 className="text-2xl font-semibold text-center">Activity & Trends</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6">
            <RSVPTrends />
            <ReachvsEngagementChart />
          </div>
        </div>
      </div>
    </div>
  );
}
