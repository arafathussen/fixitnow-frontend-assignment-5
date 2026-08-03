"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Wrench, Trash2, Tag, Loader2, FolderPlus, AlertTriangle } from "lucide-react";
import { apiCall } from "@/utils/apiCall";

type AdminServiceManagerProps = {
  initialServices: any[];
  categories: any[];
  token?: string;
};

export default function AdminServiceManager({ initialServices, categories, token }: AdminServiceManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices || []);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Category Creation Form State
  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // Delete Confirmation Dialog State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catName.trim()) {
      toast.error("Please provide a category name.");
      return;
    }

    setCatLoading(true);

    try {
      const res = await apiCall<{ data: any }>("/api/admin/categories", {
        method: "POST",
        token,
        body: { name: catName.trim(), description: catDesc.trim() },
      });

      if (!res.success) {
        // Fallback to /api/categories if needed
        const fallbackRes = await apiCall<{ data: any }>("/api/categories", {
          method: "POST",
          token,
          body: { name: catName.trim(), description: catDesc.trim() },
        });

        if (!fallbackRes.success) {
          toast.error(fallbackRes.message || "Failed to create service category.");
          setCatLoading(false);
          return;
        }
      }

      toast.success("New service category created successfully!");
      setCatOpen(false);
      setCatName("");
      setCatDesc("");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating category.");
    } finally {
      setCatLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const serviceId = deleteTarget.id;
    setDeletingId(serviceId);

    try {
      const res = await apiCall<{ data: any }>(`/api/services/${serviceId}`, {
        method: "DELETE",
        token,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to delete service.");
        setDeletingId(null);
        return;
      }

      toast.success(`Service listing "${deleteTarget.title}" deleted successfully!`);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting service.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="shadow-sm border border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" /> Service Listings & Category Oversight
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Create platform service categories or remove outdated listings.
          </CardDescription>
        </div>

        {/* Add Category Dialog */}
        <Dialog open={catOpen} onOpenChange={setCatOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <FolderPlus className="w-4 h-4" /> Add Service Category
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" /> Add New Service Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name" className="text-xs font-semibold">Category Name</Label>
                <Input
                  id="cat-name"
                  placeholder="Enter category name (e.g. Plumbing, Cleaning)"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-desc" className="text-xs font-semibold">Description</Label>
                <Textarea
                  id="cat-desc"
                  rows={3}
                  placeholder="Enter a brief description for this category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setCatOpen(false)} disabled={catLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={catLoading} className="gap-2 bg-primary">
                  {catLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="pt-6">
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No service listings found. Technicians can offer services under created categories.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s: any) => {
                const serviceTitle = s.title || s.name || "Service Listing";
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-semibold text-slate-800">
                      {serviceTitle}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] gap-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {s.category?.name || "General Service"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-bold text-slate-900">
                      ${Number(s.price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === s.id}
                        onClick={() => setDeleteTarget({ id: s.id, title: serviceTitle })}
                        className="h-8 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5 px-3"
                      >
                        {deletingId === s.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Theme-Matched Professional Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-start gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Delete Service Listing?
            </DialogTitle>
          </DialogHeader>

          <div className="text-sm text-slate-600 space-y-2 py-1">
            <p>
              Are you sure you want to delete <span className="font-semibold text-slate-900">&quot;{deleteTarget?.title}&quot;</span>?
            </p>
            <p className="text-xs text-red-500 font-medium">
              ⚠️ This action cannot be undone and will permanently remove this offering from the marketplace.
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deletingId !== null}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deletingId !== null}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs gap-2"
            >
              {deletingId !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Yes, Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
