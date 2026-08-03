"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarIcon, ClockIcon, MapPin, AlertTriangle, ShieldAlert, UserX } from "lucide-react";
import { apiCall } from "@/utils/apiCall";

type BookingFormProps = {
  serviceId: string;
  technicianId: string;
  price: number;
  duration: number;
  isAvailable?: boolean;
  userRole?: string;
  isTechBanned?: boolean;
  token?: string;
};

export default function BookingForm({ 
  serviceId, 
  technicianId, 
  price, 
  duration, 
  isAvailable = true,
  userRole,
  isTechBanned = false,
  token
}: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [address, setAddress] = useState<string>("House 12, Road 5, Dhanmondi, Dhaka");
  const [loading, setLoading] = useState(false);

  // Minimal check for tomorrow onwards
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

  const normalizedRole = (userRole || "").toUpperCase();
  const isTech = normalizedRole === "TECHNICIAN";
  const isAdmin = normalizedRole === "ADMIN";
  const isNonCustomer = isTech || isAdmin;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTechBanned) {
      toast.error("This technician's account is currently suspended by Administrator. Bookings are disabled.");
      return;
    }

    if (isAdmin) {
      toast.error("Logged in as Admin. Admins cannot book services. Please log in with a Customer account.");
      return;
    }

    if (isTech) {
      toast.error("Logged in as Technician. Technicians cannot book services. Please log in with a Customer account.");
      return;
    }

    if (!isAvailable) {
      toast.error("Technician is currently offline and not accepting new bookings.");
      return;
    }

    if (!date || !time) {
      toast.error("Please select both a date and time for your booking.");
      return;
    }

    if (!address || address.trim().length < 5) {
      toast.error("Please enter a valid service address (at least 5 characters).");
      return;
    }

    setLoading(true);
    try {
      const bookingDateTime = date && time ? new Date(`${date}T${time}`) : new Date(date);
      const payload = {
        serviceId,
        technicianId,
        bookingDate: bookingDateTime.toISOString(),
        address: address.trim(),
      };

      const result = await apiCall("/api/bookings", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });

      if (result.success) {
        toast.success("Booking requested successfully! Please wait for the technician to accept.");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to submit booking. Only Customer accounts can make bookings.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50"></div>
      <CardHeader>
        <CardTitle className="text-xl">Book This Service</CardTitle>
      </CardHeader>
      <CardContent>
        {isTechBanned && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs font-medium flex items-center gap-2 mb-4">
            <UserX className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Technician Suspended. Booking requests are disabled by Administrator.</span>
          </div>
        )}

        {isAdmin && !isTechBanned && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-xs font-medium flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Logged in as Admin. Admins cannot book services. Only customers can request bookings.</span>
          </div>
        )}

        {isTech && !isTechBanned && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg text-xs font-medium flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Logged in as Technician. Technicians cannot book services. Please switch to a Customer account.</span>
          </div>
        )}

        {!isAvailable && !isNonCustomer && !isTechBanned && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs font-medium flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Technician is currently offline. Booking requests are disabled.</span>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" /> Select Date
              </Label>
              <Input 
                type="date" 
                id="date"
                min={minDate}
                value={date}
                disabled={!isAvailable || isNonCustomer || isTechBanned}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => {
                  if (!isNonCustomer && !isTechBanned && "showPicker" in HTMLInputElement.prototype) {
                    (e.target as HTMLInputElement).showPicker();
                  }
                }}
                required={!isNonCustomer && !isTechBanned}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-muted-foreground" /> Select Time
              </Label>
              <Input 
                type="time" 
                id="time"
                value={time}
                disabled={!isAvailable || isNonCustomer || isTechBanned}
                onChange={(e) => setTime(e.target.value)}
                onClick={(e) => {
                  if (!isNonCustomer && !isTechBanned && "showPicker" in HTMLInputElement.prototype) {
                    (e.target as HTMLInputElement).showPicker();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" /> Service Location Address
              </Label>
              <Input 
                type="text" 
                id="address"
                placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                value={address}
                disabled={!isAvailable || isNonCustomer || isTechBanned}
                onChange={(e) => setAddress(e.target.value)}
                required={!isNonCustomer && !isTechBanned}
              />
            </div>
          </div>

          <div className="bg-muted/40 p-4 rounded-xl border border-muted space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="font-medium">${price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Est. Duration</span>
              <span className="font-medium">{duration} Hours</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">${price}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full font-semibold" 
            size="lg" 
            disabled={loading || !isAvailable || isNonCustomer || isTechBanned}
            variant={isTechBanned ? "destructive" : isNonCustomer ? "secondary" : !isAvailable ? "secondary" : "default"}
          >
            {isTechBanned
              ? "Technician Account Banned"
              : isAdmin 
              ? "Admins Cannot Book" 
              : isTech 
              ? "Technicians Cannot Book" 
              : !isAvailable 
              ? "Technician Currently Offline" 
              : loading 
              ? "Requesting..." 
              : "Confirm Booking Request"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {isTechBanned
              ? "Booking is unavailable because this technician is suspended."
              : isNonCustomer 
              ? "Please switch to a Customer account to make bookings." 
              : "You won't be charged until the technician accepts the request."}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
