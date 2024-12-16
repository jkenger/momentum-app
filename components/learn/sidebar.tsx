// components/learn/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, GraduationCap, LineChart, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const learn = [
  {
    category: "Getting Started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/learn" },
      { title: "Trading Basics", href: "/learn/basics" },
      { title: "Platform Overview", href: "/learn/platform" },
    ],
  },
  {
    category: "Trading Strategies",
    icon: LineChart,
    items: [
      { title: "EMA Crossover", href: "/learn/ema-crossover" },
      { title: "Volume Breakout", href: "/learn/volume-breakout" },
      { title: "Custom Strategies", href: "/learn/custom" },
    ],
  },
  {
    category: "Risk Management",
    icon: ShieldAlert,
    items: [
      { title: "Position Sizing", href: "/learn/position-sizing" },
      { title: "Stop Loss Strategies", href: "/learn/stop-loss" },
      { title: "Portfolio Management", href: "/learn/portfolio" },
    ],
  },
  {
    category: "Advanced Topics",
    icon: GraduationCap,
    items: [
      { title: "Technical Analysis", href: "/learn/technical-analysis" },
      { title: "Market Psychology", href: "/learn/psychology" },
      { title: "Backtesting", href: "/learn/backtesting" },
    ],
  },
];

export function LearnSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-muted/10">
      <ScrollArea className="h-full py-6">
        <div className="px-4 py-2">
          <h2 className="px-2 text-lg font-semibold">Documentation</h2>
        </div>
        <div className="space-y-4">
          {learn.map((section) => (
            <div key={section.category} className="px-3 py-2">
              <h3 className="mb-2 px-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  {section.category}
                </div>
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href ? "bg-muted" : "hover:bg-muted"
                    )}
                    asChild
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
