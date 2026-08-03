import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <Card className="border shadow-lg bg-card">
        <CardContent className="p-8 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Payment Cancelled
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your Stripe Checkout session was cancelled or ended before completion. No charges were made to your account.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/50 rounded-lg p-4 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <span>You can retry paying for your accepted booking at any time directly from your Customer Dashboard.</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "gap-2 font-semibold" })}>
              <RefreshCw className="w-4 h-4" /> Return to Dashboard to Retry
            </Link>
            <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}>
              <ArrowLeft className="w-4 h-4" /> Return to Services
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
