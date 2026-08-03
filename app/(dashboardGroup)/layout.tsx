import Navbar from "@/components/Navbar";

// Dashboard layout — shared navbar + main dashboard content
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 bg-background/50">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© 2026 FixItNow Dashboard Portal.</p>
        </div>
      </footer>
    </div>
  );
}
