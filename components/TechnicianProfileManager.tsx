"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wrench, CheckCircle, Power } from "lucide-react";

interface Props {
  initialProfile: {
    bio?: string;
    skills?: string[];
    experienceYears?: number;
    hourlyRate?: number;
    isAvailable?: boolean;
  } | null;
  token: string;
}

export default function TechnicianProfileManager({ initialProfile, token }: Props) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean>(initialProfile?.isAvailable ?? true);
  const [bio, setBio] = useState<string>(initialProfile?.bio || "");
  const [experience, setExperience] = useState<number>(initialProfile?.experienceYears || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";
      const res = await fetch(`${apiUrl}/api/technicians/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ isAvailable: nextState }),
      });

      if (res.ok) {
        setMessage(`Status updated to ${nextState ? "Available" : "Busy/Unavailable"}`);
      } else {
        // Fallback endpoint
        await fetch(`${apiUrl}/api/technician`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ isAvailable: nextState }),
        });
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";
      const res = await fetch(`${apiUrl}/api/technicians/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          bio,
          experienceYears: Number(experience),
          isAvailable,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Technician Availability & Settings
          </CardTitle>
          <CardDescription>Toggle your availability status to accept new jobs.</CardDescription>
        </div>
        <Button
          onClick={handleToggleAvailability}
          disabled={loading}
          variant={isAvailable ? "default" : "destructive"}
          className="gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
          {isAvailable ? "Accepting Jobs (Active)" : "Offline (Unavailable)"}
        </Button>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="p-3 mb-4 text-xs font-medium text-green-700 bg-green-50 rounded-md flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Years of Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full text-sm p-2 rounded-md border bg-background"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Availability Status</label>
              <div className="p-2 border rounded-md bg-muted/30 text-sm font-semibold flex items-center gap-2">
                <Badge variant={isAvailable ? "default" : "secondary"}>
                  {isAvailable ? "🟢 True (Available)" : "🔴 False (Busy)"}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Bio / Profile Description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Tell customers about your skills and expertise..."
              className="w-full text-sm p-2 rounded-md border bg-background"
            />
          </div>

          <Button type="submit" disabled={loading} size="sm" className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save Profile Info"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
