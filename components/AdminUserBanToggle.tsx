"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserCheck, UserX, Shield } from "lucide-react";
import { apiCall } from "@/utils/apiCall";

type AdminUserBanToggleProps = {
  userId: string;
  role: string;
  isBanned: boolean;
  token?: string;
};

export default function AdminUserBanToggle({ userId, role, isBanned: initialIsBanned, token }: AdminUserBanToggleProps) {
  const router = useRouter();
  const [isBanned, setIsBanned] = useState(initialIsBanned);
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = role?.toUpperCase() === "ADMIN";

  const handleToggleBan = async () => {
    if (isSuperAdmin) {
      toast.error("Super Admin users cannot be banned.");
      return;
    }

    setLoading(true);
    const targetStatus = !isBanned;

    try {
      const res = await apiCall<{ data: any }>(`/api/admin/users/${userId}`, {
        method: "PATCH",
        token,
        body: { isBanned: targetStatus },
      });

      if (!res.success) {
        toast.error(res.message || "Failed to update user ban status.");
        setLoading(false);
        return;
      }

      setIsBanned(targetStatus);
      toast.success(`User has been ${targetStatus ? "banned" : "unbanned"} successfully!`);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while changing user ban status.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuperAdmin) {
    return (
      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-[11px] gap-1 px-2 py-0.5">
        <Shield className="w-3 h-3 text-slate-500" /> Protected
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isBanned ? (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium text-[11px] gap-1 px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse" /> Banned
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-[11px] gap-1 px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" /> Active
        </Badge>
      )}

      <Button
        variant={isBanned ? "default" : "destructive"}
        size="sm"
        disabled={loading}
        onClick={handleToggleBan}
        className={`h-8 text-xs font-semibold px-3 gap-1.5 rounded-md ${
          isBanned 
            ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
      >
        {isBanned ? (
          <>
            <UserCheck className="w-3.5 h-3.5" />
            {loading ? "Unbanning..." : "Unban User"}
          </>
        ) : (
          <>
            <UserX className="w-3.5 h-3.5" />
            {loading ? "Banning..." : "Ban User"}
          </>
        )}
      </Button>
    </div>
  );
}
