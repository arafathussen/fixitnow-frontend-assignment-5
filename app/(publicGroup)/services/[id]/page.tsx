import { apiCall } from "@/utils/apiCall";
import { notFound } from "next/navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Star, MapPin, User, MessageSquare, ThumbsUp, Tag } from "lucide-react";
import BookingForm from "./BookingForm";
import { getCategoryFallbackImage } from "@/utils/categoryImages";

export const dynamic = "force-dynamic";

type ServiceDetailsProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  category: { id: string; name: string };
  technician: { 
    id: string; 
    userId?: string;
    rating: number; 
    experienceYears: number;
    isAvailable?: boolean;
    user: { name: string; address: string } 
  };
};

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Get current logged-in user role
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let userRole = "";
  if (token) {
    const decoded = jwtUtils.verifyToken(token);
    if (decoded.success) {
      userRole = (decoded.data?.role || "").toUpperCase();
    }
  }

  // Fetch service details and all reviews
  const [serviceRes, reviewsRes] = await Promise.all([
    apiCall<any>(`/api/services/${id}`, { cache: "no-store" }),
    apiCall<any>("/api/reviews", { cache: "no-store" })
  ]);

  if (!serviceRes.success || !serviceRes.data) {
    notFound();
  }

  const service: ServiceDetailsProps = serviceRes.data.data ? serviceRes.data.data : serviceRes.data;
  const allReviews: any[] = reviewsRes.success ? (reviewsRes.data?.data || reviewsRes.data || []) : [];

  // Filter reviews strictly matching THIS specific service via booking ID lookup
  const serviceBookingIds = new Set(((service as any).bookings || []).map((b: any) => b.id));

  const serviceReviews = allReviews
    .filter((r: any) => {
      const reviewServiceId = r.booking?.serviceId || r.serviceId;
      if (reviewServiceId) {
        return reviewServiceId === service.id;
      }
      return Boolean(r.bookingId && serviceBookingIds.has(r.bookingId));
    })
    .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const displayImage = service.imageUrl || getCategoryFallbackImage(service.category?.name, service.title);
  const isTechOnline = service.technician?.isAvailable !== false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Service, Technician & Customer Reviews */}
        <div className="md:col-span-2 space-y-8">
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-muted shadow-sm">
            <Image
              src={displayImage}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {/* Category Badge - Exactly h-7 rounded-full */}
              <Badge variant="secondary" className="h-7 px-3 py-1 text-xs font-medium bg-white/95 text-slate-800 backdrop-blur-md shadow-xs border border-slate-200/60 rounded-full flex items-center">
                {service.category?.name || "Service"}
              </Badge>
              
              {/* Online / Offline Status Badge - Exactly h-7 rounded-full with matching height */}
              <Badge
                variant="secondary"
                className={`h-7 px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-xs border rounded-full flex items-center gap-1.5 ${
                  isTechOnline
                    ? "bg-white/95 text-slate-900 border-emerald-300"
                    : "bg-white/95 text-slate-900 border-rose-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${isTechOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                <span>{isTechOnline ? "Online" : "Offline"}</span>
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">
                  {service.duration >= 60
                    ? `${Math.round(service.duration / 60)} ${Math.round(service.duration / 60) === 1 ? "Hour" : "Hours"}`
                    : `${service.duration || 1} ${Number(service.duration) === 1 ? "Hour" : "Hours"}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <span className="font-bold text-primary text-base">${service.price}</span>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Service Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-line leading-relaxed">{service.description || "No description provided."}</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About the Technician</h2>
              <Card className="bg-muted/30 border-muted">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-lg font-bold">{service.technician?.user?.name || "Pro Technician"}</h3>
                      <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 gap-1 text-[11px]">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {service.category?.name || "General"}
                      </Badge>
                      <Badge variant="outline" className={isTechOnline && !service.technician?.user?.isBanned ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}>
                        {service.technician?.user?.isBanned ? "Suspended" : isTechOnline ? "Available" : "Offline"}
                      </Badge>
                      {service.technician?.user?.isBanned && (
                        <Badge variant="destructive" className="bg-rose-600 text-white font-semibold gap-1 text-[11px]">
                          🚫 Account Banned
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{service.technician?.rating && Number(service.technician.rating) > 0 ? Number(service.technician.rating).toFixed(1) : "New ✨"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.technician?.user?.address || "Remote"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Service-Specific Customer Reviews Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Customer Reviews ({serviceReviews.length})</h2>
                </div>
                {serviceReviews.length > 0 && (
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>
                      {(
                        serviceReviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / serviceReviews.length
                      ).toFixed(1)} / 5.0 Average
                    </span>
                  </div>
                )}
              </div>

              {serviceReviews.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground space-y-2">
                    <ThumbsUp className="w-8 h-8 mx-auto text-muted-foreground/50" />
                    <p className="font-medium">No reviews yet for this specific service.</p>
                    <p className="text-xs">Book this service and be the first customer to leave feedback after completion!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {serviceReviews.map((review: any, idx: number) => (
                    <Card key={review.id || idx} className="border shadow-xs">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {(review.customer?.name || review.user?.name || "Customer")[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{review.customer?.name || review.user?.name || "Verified Customer"}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent Review"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < (review.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-10 leading-relaxed">
                          "{review.comment || review.content || "Great service! Very satisfied with the technician's work."}"
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <BookingForm 
              serviceId={service.id} 
              technicianId={service.technician?.id} 
              price={service.price}
              duration={service.duration}
              isAvailable={isTechOnline}
              userRole={userRole}
              isTechBanned={Boolean(service.technician?.user?.isBanned)}
              token={token}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
