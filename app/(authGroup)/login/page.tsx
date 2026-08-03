"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/utils/apiCall";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const isBannedQuery = searchParams.get("banned") === "true";

  useEffect(() => {
    if (isBannedQuery) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.error("🚫 Your account has been banned by Administrator! Access denied. You have been logged out.");
    }
  }, [isBannedQuery]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (email: string, password: string) => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationErrors = validate(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    // Clear old session token cookie before submitting new login request
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    const result = await apiCall<{ token: string; user: { role: string } }>(
      "/api/auth/login",
      { method: "POST", body: { email, password } }
    );

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Login failed. Please check your credentials.");
      return;
    }

    const token = result.data?.token || (result.data as any)?.accessToken || (result.data as any)?.data?.accessToken;
    const userData = result.data?.user || (result.data as any)?.data?.user;

    // Direct check on user object if available
    if (userData?.isBanned || result.message?.toLowerCase().includes("banned")) {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.error("🚫 Account Banned: Your account has been suspended by Administrator. Access denied.");
      return;
    }

    // Verify token against /api/auth/me for live backend status check
    if (token) {
      const meCheck = await apiCall<{ data: any }>("/api/auth/me", { token, cache: "no-store" });
      if (!meCheck.success || meCheck.message?.toLowerCase().includes("banned") || (meCheck.data as any)?.isBanned) {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        toast.error("🚫 Account Banned: Your account has been suspended by Administrator. Access denied.");
        return;
      }
    }

    // Store token in cookie only after verified active
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }

    toast.success("Welcome back!");

    const role = userData?.role || result.data?.user?.role;
    let targetPath = "/";
    if (role === "CUSTOMER") targetPath = redirectTo === "/" ? "/dashboard" : redirectTo;
    else if (role === "TECHNICIAN") targetPath = "/technician-dashboard";
    else if (role === "ADMIN") targetPath = "/admin-dashboard";

    window.location.href = targetPath;
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border rounded-xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
