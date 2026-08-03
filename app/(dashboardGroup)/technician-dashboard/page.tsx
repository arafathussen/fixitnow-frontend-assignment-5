import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiCall } from "@/utils/apiCall";
import { jwtUtils } from "@/utils/jwt";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Clock, Wrench } from "lucide-react";
import TechnicianBookingActions from "@/components/TechnicianBookingActions";
import TechnicianAvailabilityToggle from "@/components/TechnicianAvailabilityToggle";
import TechnicianServiceAddModal from "@/components/TechnicianServiceAddModal";

function getStatusBadge(status: string) {
  switch (status) {
    case "REQUESTED": 
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">REQUESTED</Badge>;
    case "ACCEPTED": 
      return <Badge className="bg-blue-600 hover:bg-blue-700 text-white">ACCEPTED</Badge>;
    case "PAID": 
      return <Badge className="bg-purple-600 hover:bg-purple-700 text-white">PAID</Badge>;
    case "IN_PROGRESS": 
      return <Badge className="bg-green-600 hover:bg-green-700 text-white">IN_PROGRESS</Badge>;
    case "COMPLETED": 
      return <Badge className="bg-slate-500 hover:bg-slate-600 text-white">COMPLETED</Badge>;
    case "DECLINED": 
      return <Badge className="bg-red-600 hover:bg-red-700 text-white">DECLINED</Badge>;
    default: 
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function TechnicianDashboard() {
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
  if (role !== "TECHNICIAN") {
    redirect("/");
  }

  // Fetch technician bookings, profile, and categories
  const [bookingsRes, profileRes, categoriesRes] = await Promise.all([
    apiCall<{ data: any[] }>("/api/technician/bookings", { token, cache: "no-store" }),
    apiCall<{ data: any }>("/api/technician/profile", { token, cache: "no-store" }),
    apiCall<{ data: any[] }>("/api/categories", { cache: "no-store" }),
  ]);

  if (!bookingsRes.success && (bookingsRes.message?.toLowerCase().includes("banned") || profileRes.message?.toLowerCase().includes("banned"))) {
    redirect("/login");
  }

  const bookings = bookingsRes.success ? bookingsRes.data?.data || bookingsRes.data || [] : [];
  const profile = profileRes.success ? profileRes.data?.data || profileRes.data : null;
  const categories = categoriesRes.success ? categoriesRes.data?.data || categoriesRes.data || [] : [];

  const totalEarnings = bookings
    .filter((b: any) => b.status === "COMPLETED" || b.status === "PAID")
    .reduce((sum: number, b: any) => sum + (b.totalPrice || b.service?.price || 0), 0);

  const pendingRequests = bookings.filter((b: any) => b.status === "REQUESTED");
  const upcomingJobs = bookings.filter((b: any) => ["ACCEPTED", "PAID", "IN_PROGRESS"].includes(b.status));

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technician Overview</h1>
          <p className="text-muted-foreground">Manage your service requests, schedule, and offer new services.</p>
        </div>

        <div className="flex items-center gap-3">
          <TechnicianServiceAddModal categories={categories} technicianId={profile?.id || profile?.userId} token={token} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From completed and paid bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires your confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active / Upcoming Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingJobs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Accepted and in-progress jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Clean & Compact Availability Toggle Box */}
      <TechnicianAvailabilityToggle initialStatus={profile?.isAvailable !== false} token={token} />

      {/* Bookings Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incoming & Scheduled Bookings</CardTitle>
          <CardDescription>Review customer bookings, accept requests, and update progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No booking requests found at the moment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: any) => (
                  <TableRow key={booking.id || Math.random()}>
                    <TableCell className="font-medium">
                      {booking.customer?.name || booking.user?.name || "Customer"}
                    </TableCell>
                    <TableCell>{booking.service?.title || "Home Repair Service"}</TableCell>
                    <TableCell>
                      {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "Scheduled"}
                      {booking.slotTime && ` (${booking.slotTime})`}
                    </TableCell>
                    <TableCell>${booking.totalPrice || booking.service?.price || 0}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <TechnicianBookingActions bookingId={booking.id} currentStatus={booking.status} token={token} />
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
