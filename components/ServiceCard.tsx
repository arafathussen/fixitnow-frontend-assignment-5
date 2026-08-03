import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCategoryFallbackImage } from "@/utils/categoryImages";

export type ServiceProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  category: { id: string; name: string; description?: string };
  technician: { id: string; rating: number; user: { name: string } };
};

export default function ServiceCard({ service }: { service: ServiceProps }) {
  const displayImage = service.imageUrl || getCategoryFallbackImage(service.category?.name, service.title);

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow pt-0">
      <div className="relative h-48 w-full bg-muted shrink-0 rounded-t-lg overflow-hidden">
        <Image
          src={displayImage}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {service.category.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1" title={service.title}>
            {service.title}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" />
            {service.technician?.rating ? service.technician.rating.toFixed(1) : "New"}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {service.description}
        </p>

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Clock className="w-4 h-4" />
            <span>
              {service.duration >= 60
                ? `${Math.round(service.duration / 60)} ${Math.round(service.duration / 60) === 1 ? "Hour" : "Hours"}`
                : `${service.duration || 1} ${Number(service.duration) === 1 ? "Hour" : "Hours"}`}
            </span>
            <span className="mx-2">•</span>
            <span className="font-medium text-foreground">By {service.technician?.user?.name || "Pro"}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold">${service.price}</span>
        </div>
        <Link href={`/services/${service.id}`} className={buttonVariants({ size: "sm" })}>
          Book Now
        </Link>
      </CardFooter>
    </Card>
  );
}
