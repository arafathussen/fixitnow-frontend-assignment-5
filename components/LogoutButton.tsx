"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear client-side cookie instantly on root path
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Hard navigate to fresh login page wiping all Next router cache and resetting connections
    window.location.href = "/login";
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-left py-1.5 px-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors font-medium"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}
