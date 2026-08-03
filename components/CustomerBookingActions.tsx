"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { CreditCard, Ban, Star, Loader2, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  bookingId: string;
  currentStatus: string;
  token: string;
}

export default function CustomerBookingActions({ bookingId, currentStatus, token }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";
      const res = await fetch(`${apiUrl}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          bookingId,
          paymentMethod: "STRIPE",
        }),
      });

      const data = await res.json();
      if (data?.data?.paymentUrl || data?.paymentUrl) {
        const url = data?.data?.paymentUrl || data?.paymentUrl;
        window.location.href = url;
      } else {
        alert("Payment session created! Check backend logs for payment redirect link.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";
      await fetch(`${apiUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });
      setReviewSuccess(true);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === "ACCEPTED") {
    return (
      <Button
        size="sm"
        onClick={handlePayNow}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 font-semibold"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
        Pay Now
      </Button>
    );
  }

  if (currentStatus === "REQUESTED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full">
        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        Awaiting Technician
      </span>
    );
  }

  if (currentStatus === "COMPLETED") {
    return (
      <Dialog>
        <DialogTrigger className={buttonVariants({ size: "sm", variant: "outline" }) + " gap-1 text-yellow-600 border-yellow-400 hover:bg-yellow-50 cursor-pointer"}>
          <Star className="w-3.5 h-3.5 fill-yellow-400" />
          Leave Review
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          {reviewSuccess ? (
            <div className="p-4 text-center text-sm font-medium text-green-700 bg-green-50 rounded-md">
              Thank you! Your review has been submitted successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-medium block mb-1">Rating (1 to 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2 text-sm border rounded-md"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                  <option value={2}>⭐⭐ (2 - Fair)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full p-2 text-sm border rounded-md"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
