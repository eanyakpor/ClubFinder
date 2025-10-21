"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: boolean; // New prop to control role requirement
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login",
  requireRole = true // Default to requiring role selection
}: ProtectedRouteProps) {
  const { user, profile, hasClub, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // First check if user is authenticated
      if (!user) {
        router.push(redirectTo);
        return;
      }
      
      // Then check if user needs to select a role (only if requireRole is true)
      if (requireRole && profile && profile.profile_type === '') {
        router.push('/role');
        return;
      }
      
      // Check if club user needs to complete onboarding
      if (requireRole && profile && profile.profile_type === 'club' && hasClub === false) {
        router.push('/onboarding/discord');
        return;
      }
    }
  }, [user, profile, hasClub, loading, router, redirectTo, requireRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login via useEffect
  }

  // If role is required and user hasn't selected one, redirect to role selection
  if (requireRole && profile && profile.profile_type === '') {
    return null; // Will redirect to /role via useEffect
  }

  // If club user hasn't completed onboarding, redirect to onboarding
  if (requireRole && profile && profile.profile_type === 'club' && hasClub === false) {
    return null; // Will redirect to /onboarding/discord via useEffect
  }

  return <>{children}</>;
}
