import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <Card className="border shadow-lg bg-card">
        <CardContent className="p-8 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Payment Successful! 🎉
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your transaction has been processed securely via Stripe. Your booking status has been updated to <span className="font-semibold text-purple-600">PAID</span>.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground flex items-center justify-center gap-2 border">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>A digital receipt has been dispatched. You can track job progress from your dashboard.</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2 font-semibold">
              <Link href="/dashboard">
                Go to Customer Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                Browse More Services
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
