"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiCall } from "@/utils/apiCall";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Role = "CUSTOMER" | "TECHNICIAN";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (name: string, email: string, password: string) => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const validationErrors = validate(name, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const result = await apiCall<{ token: string; user: { role: string } }>(
      "/api/auth/register",
      { method: "POST", body: { name, email, password, phone, address, role } }
    );

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Registration failed. Please try again.");
      return;
    }

    const token = result.data?.token || (result.data as any)?.accessToken;

    // Store token in cookie
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }
    toast.success("Account created! Welcome to FixItNow.");

    if (role === "CUSTOMER") router.push("/dashboard");
    else if (role === "TECHNICIAN") router.push("/technician-dashboard");

    router.refresh();
  };

  return (
    <div className="w-full max-w-md my-8">
      <div className="bg-card border rounded-xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join FixItNow today</p>
        </div>

        {/* Role Selection */}
        <div className="flex rounded-lg border p-1 mb-6">
          {(["CUSTOMER", "TECHNICIAN"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                role === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "CUSTOMER" ? "👤 Customer" : "🔧 Technician"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Enter your full name" disabled={loading} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email address" disabled={loading} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Create a password (min 6 characters)" disabled={loading} />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" disabled={loading} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Location Address</Label>
            <Input id="address" name="address" placeholder="Enter your street address & city" disabled={loading} />
          </div>

          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? "Creating account..." : `Register as ${role === "CUSTOMER" ? "Customer" : "Technician"}`}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
