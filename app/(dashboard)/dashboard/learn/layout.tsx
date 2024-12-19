// app/(dashboard)/learn/layout.tsx

import { LearnSidebar } from "@/components/learn/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen text-sm">
      <LearnSidebar />
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </div>
  );
}
