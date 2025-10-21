// Database types for Supabase SQL schema
// This represents the expected structure of our analytics tables

export interface Club {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  club_id: string;
  name: string;
  description?: string;
  event_date: string;
  rsvp_count: number;
  attendance_count: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyMetrics {
  id: string;
  club_id: string;
  month: string; // YYYY-MM format
  total_reach: number;
  total_engagement: number;
  new_members: number;
  total_rsvps: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformEngagement {
  id: string;
  club_id: string;
  platform: 'instagram' | 'discord' | 'tiktok' | 'facebook';
  clicks: number;
  impressions: number;
  engagement_rate: number;
  month: string; // YYYY-MM format
  created_at: string;
  updated_at: string;
}

// Response types for components
export interface ClubSummary {
  totalReach: number;
  previousTotalReach: number;
  newMembers: number;
  previousNewMembers: number;
  RSVPCount: number;
  previousRSVPCount: number;
  engagementRate: number;
  previousEngagementRate: number;
}
