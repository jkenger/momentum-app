// components/dashboard/nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SignalIcon,
  LineChart,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  Book,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  {
    title: "Signals",
    href: "/dashboard",
    icon: SignalIcon,
  },
  {
    title: "Charts",
    href: "/dashboard/charts",
    icon: LineChart,
  },
  {
    title: "Performance",
    href: "/dashboard/performance",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Learn",
    href: "/learn",
    icon: Book,
  },
  {
    title: "Test Signals",
    href: "/dashboard/test",
    icon: Zap, // Import Zap from lucide-react
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <SignalIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Momentum</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname.includes(item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start space-x-3"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
