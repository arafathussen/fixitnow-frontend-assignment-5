"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Mail, Shield, Phone, MapPin, Edit2, Lock, Save, X, Briefcase, DollarSign, Award, Info } from "lucide-react";
import { apiCall } from "@/utils/apiCall";

type ProfileEditFormProps = {
  user: any;
  techProfile?: any;
  token?: string;
};

export default function ProfileEditForm({ user, techProfile, token }: ProfileEditFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = (user?.role || "CUSTOMER").toUpperCase();
  const isTechnician = role === "TECHNICIAN";

  // Technician Specific States (Postman Request 5.1: bio, experienceYears, hourlyRate)
  const [bio, setBio] = useState(techProfile?.bio || "");
  const [experienceYears, setExperienceYears] = useState(techProfile?.experienceYears?.toString() || "0");
  const [hourlyRate, setHourlyRate] = useState(techProfile?.hourlyRate?.toString() || "0");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isTechnician) {
        // Send exact payload as specified in Postman Collection Section 5.1
        const techPayload = {
          bio,
          experienceYears: Number(experienceYears) || 0,
          hourlyRate: Number(hourlyRate) || 0,
        };

        const res = await apiCall<{ data: any }>("/api/technician/profile", {
          method: "PATCH",
          token,
          body: techPayload,
        });

        if (!res.success) {
          toast.error(res.message || "Failed to update technician profile.");
          setLoading(false);
          return;
        }

        toast.success("Technician profile updated successfully!");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBio(techProfile?.bio || "");
    setExperienceYears(techProfile?.experienceYears?.toString() || "0");
    setHourlyRate(techProfile?.hourlyRate?.toString() || "0");
    setIsEditing(false);
  };

  return (
    <Card className="md:col-span-2 shadow-sm border border-border/60 relative">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-xl font-bold">Account Details</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isTechnician
              ? isEditing
                ? "Modify your professional technician rates and bio below"
                : "View your personal account and professional technician profile"
              : "View your customer account details and contact information"}
          </p>
        </div>

        {isTechnician && (
          !isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Editing Mode Active
            </Badge>
          )
        )}
      </CardHeader>

      <CardContent className="pt-6">
        {/* Core Account Details (Locked / Read-Only across all roles as per backend schema) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
            <User className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-sm font-semibold">{user?.name || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-sm font-semibold">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Account Role</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-sm font-semibold">{role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Phone Number</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-sm font-semibold">{user?.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Address</p>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-sm font-semibold">{user?.address || "Not provided"}</p>
            </div>
          </div>

          {!isTechnician && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-800 flex items-start gap-2.5 mt-4 text-xs">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Customer Account Profile</p>
                <p className="text-[11px] opacity-90">Account identity details are verified upon registration and preserved securely.</p>
              </div>
            </div>
          )}
        </div>

        {/* Technician Professional Info Section */}
        {isTechnician && (
          <div className="border-t pt-5 mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Technician Professional Profile Details
            </h3>

            {!isEditing ? (
              /* View Mode for Technician Profile Details */
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Experience</p>
                    <p className="text-sm font-semibold">{techProfile?.experienceYears || 0} Years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-muted">
                  <DollarSign className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Hourly Rate</p>
                    <p className="text-sm font-semibold">${techProfile?.hourlyRate || 0} / Hour</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/40 border border-muted">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Bio / Profile Description</p>
                  <p className="text-xs leading-relaxed text-slate-700">{techProfile?.bio || "No professional description added yet."}</p>
                </div>
              </div>
            ) : (
              /* Interactive Edit Form for Technician Profile (Postman Request 5.1 Compliant) */
              <form onSubmit={handleSave} className="space-y-4 bg-muted/20 p-4 rounded-xl border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="exp" className="text-xs font-semibold text-slate-700">Years of Experience</Label>
                    <Input 
                      id="exp" 
                      type="number" 
                      min="0" 
                      value={experienceYears} 
                      onChange={(e) => setExperienceYears(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rate" className="text-xs font-semibold text-slate-700">Hourly Rate ($)</Label>
                    <Input 
                      id="rate" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">Profile Bio / Description</Label>
                  <Textarea 
                    id="bio" 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Describe your expertise, skills, and services..."
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t mt-4">
                  <Button type="submit" disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={loading} className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
