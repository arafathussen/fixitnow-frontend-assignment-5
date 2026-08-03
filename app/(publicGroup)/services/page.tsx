import ServiceCard, { ServiceProps } from "@/components/ServiceCard";
import ServicesSearchFilter from "@/components/ServicesSearchFilter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiCall } from "@/utils/apiCall";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categoryId = params.categoryId as string | undefined;
  const searchTerm = (params.search as string | undefined) || (params.searchTerm as string | undefined);
  const minPrice = params.minPrice as string | undefined;
  const maxPrice = params.maxPrice as string | undefined;
  const sortBy = params.sortBy as string | undefined;
  const sortOrder = params.sortOrder as string | undefined;

  // Build backend query string
  const query = new URLSearchParams();
  if (categoryId) query.append("categoryId", categoryId);
  if (searchTerm) query.append("searchTerm", searchTerm);
  if (minPrice) query.append("minPrice", minPrice);
  if (maxPrice) query.append("maxPrice", maxPrice);
  if (sortBy) query.append("sortBy", sortBy);
  if (sortOrder) query.append("sortOrder", sortOrder);

  // Fetch data in parallel
  const [servicesResult, categoriesResult] = await Promise.all([
    apiCall<{ data: ServiceProps[] }>(`/api/services?${query.toString()}`, { cache: "no-store" }),
    apiCall<any>("/api/categories", { cache: "no-store" }),
  ]);

  const services = servicesResult.success ? servicesResult.data?.data || [] : [];
  
  // Robust Category Data Extraction (Handles both direct Array and wrapped object)
  const rawCategories = categoriesResult.success ? categoriesResult.data : [];
  const categories: { id: string; name: string }[] = Array.isArray(rawCategories)
    ? rawCategories
    : Array.isArray(rawCategories?.data)
    ? rawCategories.data
    : [];

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Zero Page Reload Sidebar Filters */}
        <ServicesSearchFilter categories={categories} />

        {/* Main Services Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Available Services
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {services.length} verified technician offerings
              </p>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/10 space-y-3">
              <div className="w-14 h-14 bg-muted/50 rounded-full flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No matching services found</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                We couldn&apos;t find any service offerings matching your current search or price criteria.
              </p>
              <Link href="/services" className={cn(buttonVariants({ size: "sm" }), "mt-2 font-semibold")}>
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
