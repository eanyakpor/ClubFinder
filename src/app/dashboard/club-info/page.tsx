"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  Instagram,
  MessageCircle,
  Globe,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface ClubData {
  id: string;
  name: string;
  type: string;
  email: string;
  instagram_url?: string;
  discord_invite?: string;
  website_url?: string;
  pitch?: string;
  contact_email?: string;
  is_active: boolean;
  discord_guild_id?: string;
  discord_channel_id?: string;
}

export default function ClubInfoPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    instagram_url: "",
    discord_invite: "",
    website_url: "",
    pitch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fetchingData, setFetchingData] = useState(true);

  // Compute Discord connection status based on guild and channel IDs
  const discordConnected = Boolean(
    clubData?.discord_guild_id && clubData?.discord_channel_id
  );

  // Redirect if not authenticated or not a club
  useEffect(() => {
    if (!loading && (!user || (profile && profile.profile_type !== "club"))) {
      router.push("/");
    }
  }, [user, profile, loading, router]);

  // Fetch club data
  useEffect(() => {
    const fetchClubData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("clubs")
          .select("*")
          .eq("owner_user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching club data:", error);
          setMessage({
            type: "error",
            text: "Failed to load club information.",
          });
        } else if (data) {
          setClubData(data);
          setForm({
            name: data.name || "",
            email: data.email || "",
            instagram_url: data.instagram_url || "",
            discord_invite: data.discord_invite || "",
            website_url: data.website_url || "",
            pitch: data.pitch || "",
          });
        }
      } catch (error) {
        console.error("Error in fetchClubData:", error);
        setMessage({ type: "error", text: "An unexpected error occurred." });
      } finally {
        setFetchingData(false);
      }
    };

    if (user && !loading) {
      fetchClubData();
    }
  }, [user, loading, supabase]);

  function onChange<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear message when user starts editing
    if (message) setMessage(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!user || !clubData) {
      setMessage({
        type: "error",
        text: "You must be logged in and have a club.",
      });
      setSubmitting(false);
      return;
    }

    // Basic validation
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      setMessage({
        type: "error",
        text: "Club name and official email are required.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("clubs")
        .update({
          name,
          email,
          instagram_url: form.instagram_url.trim() || null,
          discord_invite: form.discord_invite.trim() || null,
          website_url: form.website_url.trim() || null,
          pitch: form.pitch.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clubData.id);

      if (error) {
        console.error("Error updating club:", error);
        setMessage({
          type: "error",
          text: "Failed to update club information.",
        });
      } else {
        setMessage({
          type: "success",
          text: "Club information updated successfully!",
        });
        // Refresh club data
        const { data } = await supabase
          .from("clubs")
          .select("*")
          .eq("id", clubData.id)
          .single();
        if (data) setClubData(data);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gradient-to-b from-primary to-secondary">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
          <span className="text-white">Loading club information...</span>
        </div>
      </div>
    );
  }

  if (!user || (profile && profile.profile_type !== "club")) {
    return null;
  }

  if (!clubData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gradient-to-b from-primary to-secondary">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>No club found. Please create a club first.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Club Information</h1>
          <p className="text-muted-foreground">
            Update your club's profile and contact details
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Club Details
            <Badge variant={clubData.is_active ? "default" : "secondary"}>
              {clubData.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Club Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="e.g., Computer Science Club"
                  className="border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch">Club Description</Label>
                <Textarea
                  id="pitch"
                  value={form.pitch}
                  onChange={(e) => onChange("pitch", e.target.value)}
                  placeholder="Tell students about your club, what you do, and why they should join..."
                  className="border-border min-h-[100px]"
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Official Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="club@university.edu"
                  className="border-border"
                />
              </div>
            </div>

            <Separator />

            {/* Social Media & Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media & Links</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="website_url"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Website URL
                  </Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={form.website_url}
                    onChange={(e) => onChange("website_url", e.target.value)}
                    placeholder="https://yourclub.com"
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="instagram_url"
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => onChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/yourclub"
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="discord_invite"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Discord Invite Link
                  </Label>
                  <Input
                    id="discord_invite"
                    type="url"
                    value={form.discord_invite}
                    onChange={(e) => onChange("discord_invite", e.target.value)}
                    placeholder="https://discord.gg/yourserver"
                    className="border-border"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Social Media Integrations */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Connected Accounts</h2>
              <p className="text-muted-foreground">
                Link your club’s social media accounts to enable automatic
                posting and updates directly from Club Finder.{" "}
              </p>
              <Link href="/onboarding/discord">
                <Button
                  variant="default"
                  disabled={discordConnected}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {discordConnected
                    ? "Connected to Discord"
                    : "Connect to Discord"}
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
