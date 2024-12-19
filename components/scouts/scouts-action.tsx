// components/scouts/scout-actions.tsx
"use client";

import { Scout } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Settings, Activity, Trash } from "lucide-react";
// import { useRouter } from "next/navigation";
import Link from "next/link";

interface ScoutActionsProps {
  scout: Scout;
  onScoutDeleted?: (id: string) => void;
}

export function ScoutActions({ scout, onScoutDeleted }: ScoutActionsProps) {
  // const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scout?")) return;

    try {
      const response = await fetch(`/api/scouts/${scout.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete scout");

      onScoutDeleted?.(scout.id);
    } catch (error) {
      console.error("Error deleting scout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={`/dashboard/scouts/${scout.id}`}>
          <DropdownMenuItem>
            <Activity className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        </Link>
        <Link href={`/dashboard/scouts/${scout.id}/settings`}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Scout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
