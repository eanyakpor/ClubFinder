import { ClubAnalyticsService } from './data/clubAnalytics';

export const getSummary = async () => {
  // Simulate fetching from Supabase database
  const clubId = 'cs-club-001'; // This would come from user context/params
  return await ClubAnalyticsService.getClubSummary(clubId);
}

// Additional data fetching functions for components
export const getMonthlyRSVPs = async () => {
  const clubId = 'cs-club-001';
  const metrics = await ClubAnalyticsService.getMonthlyMetrics(clubId);
  return metrics.map(metric => ({
    date: metric.month,
    RSVPs: metric.total_rsvps,
  }));
};

export const getReachVsEngagement = async () => {
  const clubId = 'cs-club-001';
  const metrics = await ClubAnalyticsService.getMonthlyMetrics(clubId);
  return metrics.map(metric => ({
    date: metric.month,
    reach: metric.total_reach,
    engagement: metric.total_engagement,
  }));
};

export const getEventPerformance = async () => {
  const clubId = 'cs-club-001';
  const events = await ClubAnalyticsService.getEvents(clubId);
  return events.map(event => ({
    Date: event.event_date.substring(0, 7), // Convert to YYYY-MM format
    Event: event.name,
    Rsvps: event.rsvp_count,
    Attendance: event.attendance_count,
    Engagement: Math.floor(event.attendance_count * 2.8), // Simulate engagement calculation
  }));
};

export const getPlatformEngagement = async () => {
  const clubId = 'cs-club-001';
  const platformData = await ClubAnalyticsService.getPlatformEngagement(clubId);
  
  // Platform color mapping
  const platformColors = {
    instagram: '#E1306C',
    discord: '#5865F2',
    tiktok: '#25F4EE',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
  };
  
  return platformData.map(platform => ({
    platform: platform.platform,
    clicks: platform.clicks,
    fill: platformColors[platform.platform] || '#666666',
  }));
};
