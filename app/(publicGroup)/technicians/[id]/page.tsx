import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiCall } from "@/utils/apiCall";
import { MapPin, Star, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type TechnicianProps = {
  id: string;
  bio: string;
  experienceYears: number;
  rating: number;
  profileImage?: string;
  user?: { name: string; address: string };
  services?: { id: string; title: string; price: number; duration: number; description?: string }[];
  reviews: { id: string; rating: number; comment: string; customer: { name: string } }[];
};

export default async function TechnicianProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [result, servicesResult] = await Promise.all([
    apiCall<any>(`/api/technicians/${id}`, { cache: "no-store" }),
    apiCall<any>(`/api/services?technicianId=${id}`, { cache: "no-store" })
  ]);

  if (!result.success || !result.data) {
    notFound();
  }

  // The backend might return { data: { ... } } or just the object
  const tech: TechnicianProps = result.data.data ? result.data.data : result.data;
  const techServices = servicesResult.success ? (servicesResult.data?.data || servicesResult.data || []) : [];
  const fallbackImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full bg-muted">
              <Image
              src={tech.profileImage || fallbackImage}
              alt={tech.user?.name || "Technician"}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">{tech.user?.name || "Technician"}</h1>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-medium mb-4">
                <Star className="w-5 h-5 fill-current" />
                <span>{tech.rating > 0 ? tech.rating.toFixed(1) : "New"} Rating</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{tech.user?.address || "Remote / Various"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                <Wrench className="w-4 h-4" />
                <span>{tech.experienceYears} Years Experience</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About {tech.user?.name ? tech.user.name.split(" ")[0] : "Me"}</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground bg-muted/20 p-6 rounded-xl border">
              <p>{tech.bio || "This technician hasn't added a bio yet."}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Available Services</h2>
            {techServices && techServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {techServices.map((service: any) => (
                  <Card key={service.id} className="flex flex-col">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base line-clamp-1" title={service.title || service.name}>{service.title || service.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {service.description || service.category?.description || "No description available."}
                      </p>
                      <div className="flex justify-between items-end mt-auto">
                        <div className="text-sm text-muted-foreground mb-1">
                          {service.duration} Hours
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-lg text-primary">
                            ${service.price}
                          </div>
                          <Link href={`/services/${service.id}`} className={buttonVariants({ size: "sm", variant: "secondary" })}>
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No services listed yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            {tech.reviews && tech.reviews.length > 0 ? (
              <div className="space-y-4">
                {tech.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-xl bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {review.customer?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{review.customer?.name || "User"}</p>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic bg-muted/20 p-6 rounded-xl border text-center">
                No reviews yet. Be the first to book and review!
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
