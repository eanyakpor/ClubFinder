"use client";

import { useAuth } from "./AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireRole?: boolean; // New prop to control role requirement
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  requireRole = true, // Default to requiring role selection
}: ProtectedRouteProps) {
  const { user, profile, hasClub, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If requireRole is false, only redirect non-authenticated users if they're trying to access protected content
      if (!user && requireRole) {
        router.push(redirectTo);
        return;
      }

      // If user is authenticated, check if they need to complete setup
      if (user && profile) {
        // Check if user needs to select a role
        if (profile.profile_type === "") {
          router.push("/role");
          return;
        }

        // Check if club user needs to complete onboarding
        // Don't redirect if already on onboarding pages
        const isOnOnboardingPage = pathname?.startsWith("/onboarding/");
        if (
          profile.profile_type === "club" &&
          hasClub === false &&
          !isOnOnboardingPage
        ) {
          router.push("/onboarding/club");
          return;
        }
      }
    }
  }, [user, profile, hasClub, loading, router, redirectTo, requireRole]);

  if (loading) {
    return (
      <div className="flex justify-center h-[calc(100vh-56px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If requireRole is true and user is not authenticated, don't render
  if (!user && requireRole) {
    return null; // Will redirect to login via useEffect
  }

  // If user is authenticated, check if they need to complete setup
  if (user && profile) {
    // If user hasn't selected a role, redirect to role selection
    if (profile.profile_type === "") {
      return null; // Will redirect to /role via useEffect
    }

    // If club user hasn't completed onboarding, redirect to onboarding
    // Don't redirect if already on onboarding pages
    const isOnOnboardingPage = pathname?.startsWith("/onboarding/");
    if (
      profile.profile_type === "club" &&
      hasClub === false &&
      !isOnOnboardingPage
    ) {
      return null; // Will redirect to /onboarding/club via useEffect
    }
  }

  return <>{children}</>;
}
