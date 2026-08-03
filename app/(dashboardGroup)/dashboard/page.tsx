import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiCall } from "@/utils/apiCall";
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import CustomerBookingActions from "@/components/CustomerBookingActions";

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
    case "CANCELLED": 
      return <Badge className="bg-red-800 hover:bg-red-900 text-white">CANCELLED</Badge>;
    case "DECLINED": 
      return <Badge className="bg-red-600 hover:bg-red-700 text-white">DECLINED</Badge>;
    default: 
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function CustomerDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = jwtUtils.verifyToken(token);
  if (!decoded.success || typeof decoded.data === "string" || decoded.data?.role !== "CUSTOMER") {
    redirect("/");
  }

  // Fetch bookings and payments using token
  const [bookingsRes, paymentsRes] = await Promise.all([
    apiCall<{ data: any[] }>("/api/bookings", { token, cache: "no-store" }),
    apiCall<{ data: any[] }>("/api/payments", { token, cache: "no-store" })
  ]);

  if (!bookingsRes.success && (bookingsRes.message?.toLowerCase().includes("banned") || paymentsRes.message?.toLowerCase().includes("banned"))) {
    redirect("/login");
  }

  const bookings = bookingsRes.success ? bookingsRes.data?.data || bookingsRes.data || [] : [];
  const payments = paymentsRes.success ? paymentsRes.data?.data || paymentsRes.data || [] : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your bookings, view payment history, and track status.</p>
        </div>
        <Link href="/services" className={buttonVariants({ variant: "default" })}>
          Book New Service
        </Link>
      </div>

      <div className="grid gap-8">
        {/* Bookings Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bookings found. <Link href="/services" className="text-primary underline font-medium">Book a service</Link> to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking: any) => (
                    <TableRow key={booking.id || Math.random()}>
                      <TableCell className="font-medium">
                        {booking.service?.title || "Home Service"}
                      </TableCell>
                      <TableCell>
                        {booking.technician?.user?.name || booking.technician?.name || "Assigned Technician"}
                      </TableCell>
                      <TableCell>
                        {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "Scheduled"}
                        {booking.slotTime && ` (${booking.slotTime})`}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-700">
                        ${booking.totalPrice || booking.service?.price || "0"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <CustomerBookingActions bookingId={booking.id} currentStatus={booking.status} token={token} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payment History Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No payment history available yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id || Math.random()}>
                      <TableCell className="font-mono text-xs">{payment.transactionId || payment.id}</TableCell>
                      <TableCell className="font-semibold">${payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 uppercase font-semibold text-[10px]">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
