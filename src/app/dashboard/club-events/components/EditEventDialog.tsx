"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Loader2, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "../../../components/AuthProvider";

interface EditEventDialogProps {
  event: {
    id: string;
    title: string;
    club: string;
    start: string;
    location?: string | null;
    status?: string;
  };
  onEventUpdated?: () => void;
}

export default function EditEventDialog({ event, onEventUpdated }: EditEventDialogProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    repeat_weekly: false,
  });

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && event) {
      console.log("Initializing edit form with event:", event);
      const startDate = new Date(event.start);
      const date = startDate.toISOString().split('T')[0];
      const time = startDate.toTimeString().slice(0, 5);
      
      setForm({
        title: event.title || "",
        description: "",
        location: event.location || "",
        date,
        time,
        repeat_weekly: false,
      });
      setMessage(null);
    }
  }, [open, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!form.title.trim()) {
        setMessage({ type: 'error', text: 'Event title is required' });
        setLoading(false);
        return;
      }

      if (!form.date || !form.time) {
        setMessage({ type: 'error', text: 'Date and time are required' });
        setLoading(false);
        return;
      }

      // Create ISO timestamp
      const startDate = new Date(`${form.date}T${form.time}`);
      if (isNaN(startDate.getTime())) {
        setMessage({ type: 'error', text: 'Invalid date or time format' });
        setLoading(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        start_time: startDate.toISOString(),
        repeat_weekly: form.repeat_weekly,
        status: 'pending', // Reset status to pending when event is updated
      };

      console.log("Updating event with payload:", payload);
      console.log("Event ID:", event.id);
      console.log("User ID:", user.id);

      const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event.id)
        .eq("owner_user_id", user.id)
        .select(); // Add select to see what was updated

      if (error) {
        console.error("Error updating event:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setMessage({ type: 'error', text: `Failed to update event: ${error.message}` });
      } else {
        console.log("Event updated successfully:", data);
        setMessage({ type: 'success', text: 'Event updated successfully!' });
        setTimeout(() => {
          setOpen(false);
          onEventUpdated?.();
        }, 1500);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Enter event title"
              className="border-border"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Event description (optional)"
              className="border-border min-h-[100px]"
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Event location"
              className="border-border"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => onChange("date", e.target.value)}
                className="border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => onChange("time", e.target.value)}
                className="border-border"
                required
              />
            </div>
          </div>

          {/* Repeat Weekly */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="repeat_weekly"
              checked={form.repeat_weekly}
              onCheckedChange={(checked) => onChange("repeat_weekly", checked === true)}
              className="bg-card cursor-pointer border-border"
            />
            <Label htmlFor="repeat_weekly" className="text-sm cursor-pointer">
              Repeat weekly
            </Label>
          </div>

          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Event
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
