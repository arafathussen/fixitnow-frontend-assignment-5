import Image from "next/image";
import Link from "next/link";
import NavbarAuth from "@/components/NavbarAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar({ sectionTitle }: { sectionTitle?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="FixItNow Logo" 
              width={28} 
              height={28} 
              className="object-contain"
              priority
            />
            <span>FixItNow</span>
          </Link>

          {sectionTitle && (
            <span className="text-muted-foreground text-xs md:text-sm font-medium border-l pl-3 hidden sm:inline">
              {sectionTitle}
            </span>
          )}
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Services
          </Link>
          <NavbarAuth />
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <NavbarAuth />
          <Sheet>
            <SheetTrigger className="p-2 text-foreground/70 hover:text-foreground transition-colors">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/logo.png" alt="FixItNow Logo" width={24} height={24} className="object-contain" />
                  FixItNow
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/services" className="text-lg font-medium hover:text-primary transition-colors">
                  Services
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
