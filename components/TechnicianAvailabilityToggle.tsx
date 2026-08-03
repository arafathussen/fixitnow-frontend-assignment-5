"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Power, Info, CheckCircle2 } from "lucide-react";

interface Props {
  initialStatus?: boolean;
  token: string;
}

export default function TechnicianAvailabilityToggle({ initialStatus = true, token }: Props) {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState<boolean>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggle = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    setLoading(true);
    setToastMessage(null);

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

      if (!res.ok) {
        await fetch(`${apiUrl}/api/technician`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ isAvailable: nextState }),
        });
      }

      setToastMessage(nextState ? "You are now Online & Accepting Jobs!" : "You are now Offline (Unavailable).");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm bg-card">
      <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">Service Availability Status</h3>
            <Badge
              variant="outline"
              className={isAvailable ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}
            >
              {isAvailable ? "🟢 Online" : "🔴 Offline"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            {isAvailable
              ? "Turn OFF when you are busy or taking a break to temporarily stop receiving new customer requests."
              : "Turn ON to make your profile visible to customers and start accepting new bookings."}
          </p>
          {toastMessage && (
            <p className="text-xs font-medium text-green-600 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {toastMessage}
            </p>
          )}
        </div>

        <Button
          onClick={handleToggle}
          disabled={loading}
          variant={isAvailable ? "outline" : "default"}
          className="gap-2 min-w-[160px] font-medium shadow-sm transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className={`w-4 h-4 ${isAvailable ? "text-rose-500" : "text-emerald-400"}`} />}
          {isAvailable ? "Switch to Offline" : "Switch to Online"}
        </Button>
      </CardContent>
    </Card>
  );
}
