import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSummary } from "@/app/lib/analyticsClient";

export async function SectionCards() {
  const {
    totalReach,
    previousTotalReach,
    newMembers,
    previousNewMembers,
    RSVPCount,
    previousRSVPCount,
    engagementRate,
    previousEngagementRate,
  } = await getSummary();

  const getPercentageChange = (previousValue: number, currentValue: number) => {
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    return percentageChange.toFixed(1);
  };

  return (
    <div className="dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-10 lg:px-20 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Reach/Impressions */}

      <Card className="@container/card">
        <CardHeader className="">
          <CardTitle className="">Total Reach</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`${
                totalReach > previousTotalReach
                  ? "text-green-600 border-green-600"
                  : "text-red-500 border-red-500"
              }`}
            >
              {totalReach > previousTotalReach ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {getPercentageChange(previousTotalReach, totalReach)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardDescription className="px-6 text-2xl font-semibold text-card-foreground">
          {totalReach.toLocaleString()}
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalReach > previousTotalReach ? (
              <>
                Visibility is growing this month{" "}
                <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Fewer students reached this month{" "}
                <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            How many people viewed your events
          </div>
        </CardFooter>
      </Card>

      {/* New Members */}

      <Card className="@container/card">
        <CardHeader className="">
          <CardTitle className="">New Members</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`${
                newMembers > previousNewMembers
                  ? "text-green-600 border-green-600"
                  : "text-red-500 border-red-500"
              }`}
            >
              {newMembers > previousNewMembers ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {getPercentageChange(previousNewMembers, newMembers)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardDescription className="px-6 text-2xl font-semibold text-card-foreground">
          {newMembers.toLocaleString()}
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {newMembers > previousNewMembers ? (
              <>
                Membership growth increasing <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Member sign-ups slowing down <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Members joined this month</div>
        </CardFooter>
      </Card>

      {/* RSVP Count */}

      <Card className="@container/card">
        <CardHeader className="">
          <CardTitle className="">RSVP Count</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`${
                RSVPCount > previousRSVPCount
                  ? "text-green-600 border-green-600"
                  : "text-red-500 border-red-500"
              }`}
            >
              {RSVPCount > previousRSVPCount ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {getPercentageChange(previousRSVPCount, RSVPCount)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardDescription className="px-6 text-2xl font-semibold text-card-foreground">
          {RSVPCount.toLocaleString()}
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {RSVPCount > previousRSVPCount ? (
              <>
                Event participation on the rise{" "}
                <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Fewer RSVPs across events <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Confirmed attendees across all events
          </div>
        </CardFooter>
      </Card>

      {/* Engagement Rate */}

      <Card className="@container/card">
        <CardHeader className="">
          <CardTitle className="">Engagement Rate</CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={`${
                engagementRate > previousEngagementRate
                  ? "text-green-600 border-green-600"
                  : "text-red-500 border-red-500"
              }`}
            >
              {engagementRate > previousEngagementRate ? (
                <TrendingUp />
              ) : (
                <TrendingDown />
              )}
              {getPercentageChange(previousEngagementRate, engagementRate)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardDescription className="px-6 text-2xl font-semibold text-card-foreground">
          {engagementRate.toFixed(1)}%
        </CardDescription>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {engagementRate > previousEngagementRate ? (
              <>
                Audience interactions increasing{" "}
                <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Lower engagement on recent posts{" "}
                <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Interaction levels from likes, comments, and link clicks.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
