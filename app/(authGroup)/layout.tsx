import Image from "next/image";
import Link from "next/link";

// Auth layout — centered card, no navbar
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-2xl text-primary">
        <Image src="/logo.png" alt="FixItNow Logo" width={32} height={32} className="object-contain" />
        FixItNow
      </Link>
      {children}
    </div>
  );
}
