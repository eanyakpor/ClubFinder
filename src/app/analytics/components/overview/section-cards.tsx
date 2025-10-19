import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

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
        <CardHeader>
          <CardDescription>Total Reach/Impressions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalReach.toLocaleString()}
          </CardTitle>
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
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {getPercentageChange(previousTotalReach, totalReach)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalReach > previousTotalReach ? (
              <>
                Visibility is growing this month{" "}
                <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Fewer students reached this month{" "}
                <IconTrendingDown className="size-4" />
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
        <CardHeader>
          <CardDescription>New Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newMembers.toLocaleString()}
          </CardTitle>
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
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {getPercentageChange(previousNewMembers, newMembers)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {newMembers > previousNewMembers ? (
              <>
                Membership growth increasing{" "}
                <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Member sign-ups slowing down{" "}
                <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Members joined this month</div>
        </CardFooter>
      </Card>

      {/* RSVP Count */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>RSVP Count</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {RSVPCount.toLocaleString()}
          </CardTitle>
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
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {getPercentageChange(previousRSVPCount, RSVPCount)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {RSVPCount > previousRSVPCount ? (
              <>
                Event participation on the rise{" "}
                <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Fewer RSVPs across events{" "}
                <IconTrendingDown className="size-4" />
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
        <CardHeader>
          <CardDescription>Engagement Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {engagementRate.toFixed(1)}%
          </CardTitle>
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
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {getPercentageChange(previousEngagementRate, engagementRate)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {engagementRate > previousEngagementRate ? (
              <>
                Audience interactions increasing{" "}
                <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Lower engagement on recent posts{" "}
                <IconTrendingDown className="size-4" />
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
