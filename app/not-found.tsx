import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for does not exist or you don&apos;t have permission to access it.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
