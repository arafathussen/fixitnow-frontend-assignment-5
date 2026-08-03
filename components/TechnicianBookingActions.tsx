"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Play, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  bookingId: string;
  currentStatus: string;
  token: string;
}

export default function TechnicianBookingActions({ bookingId, currentStatus, token }: Props) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const updateStatus = async (newStatus: string) => {
    setLoadingAction(newStatus);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";
      const res = await fetch(`${apiUrl}/api/technician/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Alternative endpoint check if needed
        const altRes = await fetch(`${apiUrl}/api/technicians/bookings/${bookingId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!altRes.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to update status");
        }
      }

      router.refresh();
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message || "Failed to update booking status");
    } finally {
      setLoadingAction(null);
    }
  };

  if (currentStatus === "REQUESTED") {
    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
          disabled={!!loadingAction}
          onClick={() => updateStatus("ACCEPTED")}
        >
          {loadingAction === "ACCEPTED" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Accept
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="gap-1"
          disabled={!!loadingAction}
          onClick={() => updateStatus("DECLINED")}
        >
          {loadingAction === "DECLINED" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
          Decline
        </Button>
      </div>
    );
  }

  if (currentStatus === "PAID") {
    return (
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white gap-1"
        disabled={!!loadingAction}
        onClick={() => updateStatus("IN_PROGRESS")}
      >
        {loadingAction === "IN_PROGRESS" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
        Start Job
      </Button>
    );
  }

  if (currentStatus === "IN_PROGRESS") {
    return (
      <Button
        size="sm"
        className="bg-slate-700 hover:bg-slate-800 text-white gap-1"
        disabled={!!loadingAction}
        onClick={() => updateStatus("COMPLETED")}
      >
        {loadingAction === "COMPLETED" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
        Complete Job
      </Button>
    );
  }

  return null;
}
