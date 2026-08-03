import { cookies } from "next/headers";
import Link from "next/link";
import { jwtUtils } from "@/utils/jwt";
import { apiCall } from "@/utils/apiCall";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function NavbarAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <Link href="/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Login
      </Link>
    );
  }

  const decoded = jwtUtils.verifyToken(token);
  
  if (!decoded.success || !decoded.data) {
    return (
      <Link href="/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Login
      </Link>
    );
  }

  const payload = decoded.data as any;

  const email = payload.email || "";
  const role = (payload.role || "USER").toUpperCase();
  
  let fullName = payload.name;
  if (!fullName) {
    try {
      const meRes = await apiCall<{ data: any }>("/api/auth/me", { token, cache: "no-store" });
      if (meRes && meRes.success) {
        const meUser = meRes.data?.data || meRes.data;
        fullName = meUser?.name;
      }
    } catch {
      // Safe fallback if token is invalid or user is banned
    }
  }

  if (!fullName && email) {
    const rawPrefix = email.split("@")[0];
    fullName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);
  }
  if (!fullName) fullName = "User Account";

  const initials = fullName.substring(0, 2).toUpperCase();

  let dashboardPath = "/dashboard";
  if (role === "TECHNICIAN") {
    dashboardPath = "/technician-dashboard";
  } else if (role === "ADMIN") {
    dashboardPath = "/admin-dashboard";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`} alt={fullName} />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-2 mt-2">
        <div className="flex flex-col space-y-1.5 p-2 bg-muted/40 rounded-md mb-1">
          <p className="font-semibold text-sm leading-tight text-foreground">{fullName}</p>
          {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
          <div className="pt-1">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium uppercase tracking-wider bg-background">
              {role}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={dashboardPath} className="flex items-center gap-2 py-2">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center gap-2 py-2">
            <User className="w-4 h-4 text-primary" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
