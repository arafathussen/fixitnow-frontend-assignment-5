import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiCall } from "@/utils/apiCall";
import { jwtUtils } from "@/utils/jwt";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Wrench, DollarSign, Activity, ShieldCheck } from "lucide-react";

import AdminUserBanToggle from "@/components/AdminUserBanToggle";
import AdminServiceManager from "@/components/AdminServiceManager";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = jwtUtils.verifyToken(token);
  if (!decoded.success) {
    redirect("/login");
  }

  const role = (decoded.data as any)?.role?.toUpperCase();
  if (role !== "ADMIN") {
    redirect("/");
  }

  // Fetch users, platform data, and categories for admin
  const [usersRes, bookingsRes, servicesRes, categoriesRes] = await Promise.all([
    apiCall<{ data: any[] }>("/api/admin/users", { token, cache: "no-store" }),
    apiCall<{ data: any[] }>("/api/admin/bookings", { token, cache: "no-store" }),
    apiCall<{ data: any[] }>("/api/services", { cache: "no-store" }),
    apiCall<{ data: any[] }>("/api/categories", { cache: "no-store" }),
  ]);

  const rawUsers: any = usersRes.success ? usersRes.data?.data || usersRes.data : [];
  const users: any[] = Array.isArray(rawUsers) ? rawUsers : [];

  const rawBookings: any = bookingsRes.success ? bookingsRes.data?.data || bookingsRes.data : [];
  const bookings: any[] = Array.isArray(rawBookings) ? rawBookings : [];

  const rawServices: any = servicesRes.success ? servicesRes.data?.data || servicesRes.data : [];
  const services: any[] = Array.isArray(rawServices) ? rawServices : [];

  const rawCategories: any = categoriesRes.success ? categoriesRes.data?.data || categoriesRes.data : [];
  const categories: any[] = Array.isArray(rawCategories) ? rawCategories : [];

  const totalRevenue = bookings
    .filter((b: any) => b.status === "PAID" || b.status === "COMPLETED")
    .reduce((sum: number, b: any) => sum + (b.totalPrice || b.service?.price || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Control Center</h1>
          <p className="text-muted-foreground">Overview of platform performance, registered users, and service listings.</p>
        </div>
        <Badge variant="outline" className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 text-slate-100 border-slate-800 shadow-sm flex items-center gap-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Platform Administrator</span>
        </Badge>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Customers & Technicians</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Published service categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform service requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total transactions processed</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Service Management Section */}
      <AdminServiceManager initialServices={services} categories={categories} token={token} />

      {/* User Management Section */}
      <Card className="shadow-sm border border-border/60">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> User Access & Ban Control
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            View platform users, monitor account roles, and manage access restrictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No user records found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Account Role</TableHead>
                  <TableHead className="text-right">Ban Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-semibold text-slate-800">{u.name || "N/A"}</TableCell>
                    <TableCell className="text-slate-600">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase font-mono text-[11px] px-2.5 py-0.5 bg-slate-50 text-slate-700 border-slate-200">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end">
                      <AdminUserBanToggle
                        userId={u.id}
                        role={u.role}
                        isBanned={u.isBanned || false}
                        token={token}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
