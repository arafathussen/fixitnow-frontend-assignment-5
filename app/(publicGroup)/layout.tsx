import Navbar from "@/components/Navbar";

// Public layout — has Navbar and Footer
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 FixItNow. Your Trusted Home Service Platform.</p>
        </div>
      </footer>
    </div>
  );
}
