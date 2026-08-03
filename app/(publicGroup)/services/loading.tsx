import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-screen">
      {/* Sidebar Skeleton */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden flex flex-col h-full">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 flex-1 flex flex-col gap-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
