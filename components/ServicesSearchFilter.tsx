"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, X, Loader2, DollarSign, Tag, ArrowUpDown } from "lucide-react";

type ServicesSearchFilterProps = {
  categories: { id: string; name: string }[];
};

export default function ServicesSearchFilter({ categories }: ServicesSearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("categoryId") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentSearch, currentMinPrice, currentMaxPrice]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchTerm.trim() || null });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPrice ? minPrice.toString() : null,
      maxPrice: maxPrice ? maxPrice.toString() : null,
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentSortBy !== "createdAt"
  );

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      {/* Search Input Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
            <Search className="w-4 h-4 text-primary" /> Search Services
          </h2>
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
        </div>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service title..."
            className="pl-9 pr-8 text-xs h-9 bg-background border-border/80 focus:border-primary"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                updateFilters({ search: null });
              }}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Categories Dropdown Menu */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
          <Tag className="w-4 h-4 text-primary" /> Categories
        </h2>
        <select
          value={currentCategory}
          onChange={(e) => updateFilters({ categoryId: e.target.value || null })}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
          <ArrowUpDown className="w-4 h-4 text-primary" /> Sort By
        </h2>
        <select
          value={`${currentSortBy}-${currentSortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split("-");
            updateFilters({ sortBy: by, sortOrder: order });
          }}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
        >
          <option value="createdAt-desc">Newest Additions</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
          <DollarSign className="w-4 h-4 text-primary" /> Price Range ($)
        </h2>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">Min ($)</Label>
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Max ($)</Label>
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>
          <Button type="submit" size="sm" variant="secondary" className="w-full h-8 text-xs font-semibold">
            Apply Price Filter
          </Button>
        </form>
      </div>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={clearAllFilters}
          className="w-full text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <X className="w-3.5 h-3.5" /> Clear All Filters
        </Button>
      )}
    </aside>
  );
}
