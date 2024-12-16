// app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen scroll-smooth">
      <DashboardNav />
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className="container p-6">{children}</div>
      </main>
    </div>
  );
}
