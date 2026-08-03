import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiCall } from "@/utils/apiCall";
import { jwtUtils } from "@/utils/jwt";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ProfileEditForm from "@/components/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = jwtUtils.verifyToken(token);
  if (!decoded.success) {
    redirect("/login");
  }

  const res = await apiCall<{ data: any }>("/api/auth/me", { token, cache: "no-store" });
  const userData = res.success ? res.data?.data || res.data : null;
  const user = userData || decoded.data;

  const role = (user?.role || "CUSTOMER").toUpperCase();

  let techProfile = null;
  if (role === "TECHNICIAN") {
    const techRes = await apiCall<any>("/api/technician/profile", { token, cache: "no-store" });
    if (techRes.success) {
      techProfile = techRes.data?.data || techRes.data;
    }
  }

  let backDashboard = "/dashboard";
  if (role === "TECHNICIAN") backDashboard = "/technician-dashboard";
  if (role === "ADMIN") backDashboard = "/admin-dashboard";

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account details and view your role information.</p>
        </div>
        <Link href={backDashboard} className={buttonVariants({ variant: "outline" })}>
          Back to Dashboard
        </Link>
      </div>

      {/* Grid with items-start to ensure left card doesn't stretch vertically */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Left Column: Top-Aligned Compact Avatar & Basic Info Card */}
        <Card className="md:col-span-1 shadow-sm border border-border/60">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-3 border-2 border-primary/20">
              {(user?.name || user?.email || "U").substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name || "User"}</h2>
            <p className="text-xs text-muted-foreground mb-3">{user?.email}</p>
            <Badge className="capitalize px-3 py-1 text-xs font-medium">
              {role}
            </Badge>
          </CardContent>
        </Card>

        {/* Right Column: Interactive Profile Edit Form */}
        <ProfileEditForm user={user} techProfile={techProfile} token={token} />
      </div>
    </div>
  );
}
