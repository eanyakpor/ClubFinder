// Data Access Layer - Simulates Supabase SQL queries
// This would normally connect to your Supabase database

import {
  Club,
  Event,
  MonthlyMetrics,
  PlatformEngagement,
  ClubSummary,
} from "../types/database";

// Mock database data (simulating what would be in Supabase tables)
const mockClubData: Club = {
  id: "cs-club-001",
  name: "Computer Science Club",
  description: "University Computer Science Club",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-10-18T00:00:00Z",
};

const mockMonthlyMetrics: MonthlyMetrics[] = [
  {
    id: "1",
    club_id: "cs-club-001",
    month: "2024-11",
    total_reach: 124,
    total_engagement: 10,
    new_members: 15,
    total_rsvps: 289,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-30T00:00:00Z",
  },
  {
    id: "2",
    club_id: "cs-club-001",
    month: "2024-12",
    total_reach: 155,
    total_engagement: 30,
    new_members: 22,
    total_rsvps: 304,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-31T00:00:00Z",
  },
  {
    id: "3",
    club_id: "cs-club-001",
    month: "2025-01",
    total_reach: 186,
    total_engagement: 44,
    new_members: 18,
    total_rsvps: 186,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-31T00:00:00Z",
  },
  {
    id: "4",
    club_id: "cs-club-001",
    month: "2025-02",
    total_reach: 305,
    total_engagement: 92,
    new_members: 28,
    total_rsvps: 305,
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-02-28T00:00:00Z",
  },
  {
    id: "5",
    club_id: "cs-club-001",
    month: "2025-03",
    total_reach: 237,
    total_engagement: 44,
    new_members: 25,
    total_rsvps: 237,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-31T00:00:00Z",
  },
  {
    id: "6",
    club_id: "cs-club-001",
    month: "2025-04",
    total_reach: 209,
    total_engagement: 35,
    new_members: 12,
    total_rsvps: 73,
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-30T00:00:00Z",
  },
  {
    id: "7",
    club_id: "cs-club-001",
    month: "2025-05",
    total_reach: 229,
    total_engagement: 41,
    new_members: 19,
    total_rsvps: 209,
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-31T00:00:00Z",
  },
  {
    id: "8",
    club_id: "cs-club-001",
    month: "2025-06",
    total_reach: 185,
    total_engagement: 25,
    new_members: 21,
    total_rsvps: 214,
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-30T00:00:00Z",
  },
  {
    id: "9",
    club_id: "cs-club-001",
    month: "2025-07",
    total_reach: 192,
    total_engagement: 28,
    new_members: 16,
    total_rsvps: 229,
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-31T00:00:00Z",
  },
  {
    id: "10",
    club_id: "cs-club-001",
    month: "2025-08",
    total_reach: 214,
    total_engagement: 35,
    new_members: 23,
    total_rsvps: 244,
    created_at: "2025-08-01T00:00:00Z",
    updated_at: "2025-08-31T00:00:00Z",
  },
  {
    id: "11",
    club_id: "cs-club-001",
    month: "2025-09",
    total_reach: 229,
    total_engagement: 44,
    new_members: 27,
    total_rsvps: 259,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-09-30T00:00:00Z",
  },
  {
    id: "12",
    club_id: "cs-club-001",
    month: "2025-10",
    total_reach: 244,
    total_engagement: 56,
    new_members: 34,
    total_rsvps: 232,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
];

const mockEvents: Event[] = [
  {
    id: "1",
    club_id: "cs-club-001",
    name: "Coding Competition",
    event_date: "2024-11-15",
    rsvp_count: 100,
    attendance_count: 70,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-15T00:00:00Z",
  },
  {
    id: "2",
    club_id: "cs-club-001",
    name: "Job Fair",
    event_date: "2024-12-10",
    rsvp_count: 124,
    attendance_count: 95,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "3",
    club_id: "cs-club-001",
    name: "Startup Pitch Competition",
    event_date: "2025-01-20",
    rsvp_count: 120,
    attendance_count: 95,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-20T00:00:00Z",
  },
  {
    id: "4",
    club_id: "cs-club-001",
    name: "Cybersecurity Competition",
    event_date: "2025-02-15",
    rsvp_count: 150,
    attendance_count: 120,
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-02-15T00:00:00Z",
  },
  {
    id: "5",
    club_id: "cs-club-001",
    name: "Blockchain Workshop",
    event_date: "2025-02-28",
    rsvp_count: 90,
    attendance_count: 60,
    created_at: "2025-02-15T00:00:00Z",
    updated_at: "2025-02-28T00:00:00Z",
  },
  {
    id: "6",
    club_id: "cs-club-001",
    name: "Data Science Meetup",
    event_date: "2025-03-12",
    rsvp_count: 180,
    attendance_count: 150,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-12T00:00:00Z",
  },
  {
    id: "7",
    club_id: "cs-club-001",
    name: "Leetcode Workshop",
    event_date: "2025-04-08",
    rsvp_count: 289,
    attendance_count: 220,
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-08T00:00:00Z",
  },
  {
    id: "8",
    club_id: "cs-club-001",
    name: "Mock Interview",
    event_date: "2025-04-25",
    rsvp_count: 80,
    attendance_count: 50,
    created_at: "2025-04-15T00:00:00Z",
    updated_at: "2025-04-25T00:00:00Z",
  },
  {
    id: "9",
    club_id: "cs-club-001",
    name: "Mental Health Fair",
    event_date: "2025-05-10",
    rsvp_count: 100,
    attendance_count: 70,
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "10",
    club_id: "cs-club-001",
    name: "Women in Tech Panel",
    event_date: "2025-05-22",
    rsvp_count: 140,
    attendance_count: 110,
    created_at: "2025-05-15T00:00:00Z",
    updated_at: "2025-05-22T00:00:00Z",
  },
  {
    id: "11",
    club_id: "cs-club-001",
    name: "AI Workshop",
    event_date: "2025-06-18",
    rsvp_count: 210,
    attendance_count: 180,
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-18T00:00:00Z",
  },
  {
    id: "12",
    club_id: "cs-club-001",
    name: "Resume Workshop",
    event_date: "2025-07-14",
    rsvp_count: 172,
    attendance_count: 140,
    created_at: "2025-07-01T00:00:00Z",
    updated_at: "2025-07-14T00:00:00Z",
  },
  {
    id: "13",
    club_id: "cs-club-001",
    name: "Networking Event",
    event_date: "2025-08-20",
    rsvp_count: 100,
    attendance_count: 70,
    created_at: "2025-08-01T00:00:00Z",
    updated_at: "2025-08-20T00:00:00Z",
  },
  {
    id: "14",
    club_id: "cs-club-001",
    name: "Cultural Night",
    event_date: "2025-09-12",
    rsvp_count: 150,
    attendance_count: 130,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-09-12T00:00:00Z",
  },
  {
    id: "15",
    club_id: "cs-club-001",
    name: "Homecoming Mixer",
    event_date: "2025-09-25",
    rsvp_count: 180,
    attendance_count: 150,
    created_at: "2025-09-15T00:00:00Z",
    updated_at: "2025-09-25T00:00:00Z",
  },
  {
    id: "16",
    club_id: "cs-club-001",
    name: "Welcome Week",
    event_date: "2025-10-15",
    rsvp_count: 120,
    attendance_count: 95,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-15T00:00:00Z",
  },
];

const mockPlatformEngagement: PlatformEngagement[] = [
  {
    id: "1",
    club_id: "cs-club-001",
    platform: "instagram",
    clicks: 150,
    impressions: 2000,
    engagement_rate: 7.5,
    month: "2025-10",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: "2",
    club_id: "cs-club-001",
    platform: "discord",
    clicks: 170,
    impressions: 1800,
    engagement_rate: 9.4,
    month: "2025-10",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: "3",
    club_id: "cs-club-001",
    platform: "tiktok",
    clicks: 180,
    impressions: 2200,
    engagement_rate: 8.2,
    month: "2025-10",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: "4",
    club_id: "cs-club-001",
    platform: "facebook",
    clicks: 140,
    impressions: 1600,
    engagement_rate: 8.8,
    month: "2025-10",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
];

// Simulated database queries
export class ClubAnalyticsService {
  // Simulate: SELECT * FROM clubs WHERE id = ?
  static async getClub(clubId: string): Promise<Club | null> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay
    return mockClubData.id === clubId ? mockClubData : null;
  }

  // Simulate: SELECT * FROM monthly_metrics WHERE club_id = ? ORDER BY month DESC LIMIT ?
  static async getMonthlyMetrics(
    clubId: string,
    limit = 12
  ): Promise<MonthlyMetrics[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return mockMonthlyMetrics
      .filter((metric) => metric.club_id === clubId)
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, limit);
  }

  // Simulate: SELECT * FROM events WHERE club_id = ? ORDER BY event_date DESC
  static async getEvents(clubId: string): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return mockEvents
      .filter((event) => event.club_id === clubId)
      .sort((a, b) => b.event_date.localeCompare(a.event_date));
  }

  // Simulate: SELECT * FROM platform_engagement WHERE club_id = ? AND month = ?
  static async getPlatformEngagement(
    clubId: string,
    month = "2025-10"
  ): Promise<PlatformEngagement[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return mockPlatformEngagement.filter(
      (engagement) =>
        engagement.club_id === clubId && engagement.month === month
    );
  }

  // Simulate complex query for summary metrics
  static async getClubSummary(clubId: string): Promise<ClubSummary> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const metrics = await this.getMonthlyMetrics(clubId, 2);
    const currentMonth = metrics[0];
    const previousMonth = metrics[1];

    if (!currentMonth || !previousMonth) {
      throw new Error("Insufficient data for summary");
    }

    return {
      totalReach: currentMonth.total_reach,
      previousTotalReach: previousMonth.total_reach,
      newMembers: currentMonth.new_members,
      previousNewMembers: previousMonth.new_members,
      RSVPCount: currentMonth.total_rsvps,
      previousRSVPCount: previousMonth.total_rsvps,
      engagementRate:
        (currentMonth.total_engagement / currentMonth.total_reach) * 100,
      previousEngagementRate:
        (previousMonth.total_engagement / previousMonth.total_reach) * 100,
    };
  }
}
