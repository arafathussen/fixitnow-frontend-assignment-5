"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Wrench, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiCall } from "@/utils/apiCall";

type TechnicianServiceAddModalProps = {
  categories: any[];
  technicianId?: string;
  token?: string;
};

export default function TechnicianServiceAddModal({ categories, technicianId, token }: TechnicianServiceAddModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1");
  const [description, setDescription] = useState("");

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation Checks
    if (!name || name.trim().length < 2) {
      toast.error("Service title must be at least 2 characters long.");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid base price greater than $0.");
      return;
    }

    if (!duration || Number(duration) <= 0) {
      toast.error("Please enter a valid duration in hours.");
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error(`Service description must be at least 10 characters long. (Currently ${description.trim().length} characters)`);
      return;
    }

    if (!technicianId) {
      toast.error("Unable to identify technician profile. Please refresh your page.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: name.trim(),
        categoryId: categoryId || categories[0]?.id,
        price: Number(price),
        duration: Number(duration),
        description: description.trim(),
        technicianId: technicianId,
      };

      const res = await apiCall<{ data: any }>("/api/services", {
        method: "POST",
        token,
        body: payload,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to publish new service.");
        setLoading(false);
        return;
      }

      toast.success("New service offering published successfully!");
      setOpen(false);
      setName("");
      setPrice("");
      setDuration("1");
      setDescription("");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred while publishing service.");
    } finally {
      setLoading(false);
    }
  };

  const descLength = description.trim().length;
  const isDescValid = descLength >= 10;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2 font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> Offer New Service
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" /> Publish Technician Service Listing
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateService} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="tech-service-name" className="text-xs font-semibold">Service Title</Label>
            <Input
              id="tech-service-name"
              placeholder="e.g. Glass Repair & Frame Sealing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tech-category-select" className="text-xs font-semibold">Category</Label>
            <select
              id="tech-category-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tech-service-price" className="text-xs font-semibold">Base Price ($)</Label>
              <Input
                id="tech-service-price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="32.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tech-service-duration" className="text-xs font-semibold">Est. Duration (Hours)</Label>
              <Input
                id="tech-service-duration"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="tech-service-desc" className="text-xs font-semibold">Service Details</Label>
              <span className={`text-[11px] font-medium flex items-center gap-1 ${isDescValid ? "text-primary" : "text-amber-600"}`}>
                {isDescValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {descLength} / 10 characters min
              </span>
            </div>
            <Textarea
              id="tech-service-desc"
              rows={3}
              placeholder="Describe your expertise, work guarantee, tools used, and what is included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2 font-semibold shadow-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Service Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
