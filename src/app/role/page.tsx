"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

export default function RoleSelectionPage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "club" | null>(
    null
  );
  const router = useRouter();

  const handleRoleSelection = async (role: "student" | "club") => {
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile({ profile_type: role });

      // Redirect based on role
      if (role === "club") {
        router.push("/onboarding/club");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gradient-to-b from-primary to-secondary">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Please sign in first</h1>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center md:justify-center h-[calc(100vh-56px)] p-6 gap-6 overflow-y-auto bg-gradient-to-b from-primary to-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to ClubFinder!
        </h1>
        <p className="text-white/90">
          Please select your role to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student Option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === "student"
              ? "ring-2 ring-blue-500 bg-blue-500/20"
              : ""
          }`}
          onClick={() => setSelectedRole("student")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-400/20 rounded-full w-fit">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">I'm a Student</CardTitle>
            <CardDescription>
              Discover and join events from clubs at your university
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Browse upcoming events</li>
              <li>• RSVP to events you're interested in</li>
              <li>• Discover new clubs and activities</li>
              <li>• Get personalized event recommendations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Club Option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === "club"
              ? "ring-2 ring-green-500 bg-green-500/20"
              : ""
          }`}
          onClick={() => setSelectedRole("club")}
        >
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-400/20 rounded-full w-fit">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">I'm a Club Admin</CardTitle>
            <CardDescription>
              Manage your club and create events for students
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start">
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Create and manage events</li>
              <li>• Track event attendance and RSVPs</li>
              <li>• Promote your club to students</li>
              <li>• Access analytics and insights</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <Button
        onClick={() => selectedRole && handleRoleSelection(selectedRole)}
        disabled={!selectedRole || loading}
        className="px-8 py-2 text-lg cursor-pointer"
        size="lg"
      >
        {loading ? "Setting up your account..." : "Continue"}
      </Button>
    </div>
  );
}
