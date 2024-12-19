// components/scouts/scouts-list.tsx
"use client";

import { Scout } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ScoutActions } from "./scouts-action";

interface ScoutsListProps {
  scouts: Scout[];
}

export function ScoutsList({ scouts: initialScouts }: ScoutsListProps) {
  const [scouts, setScouts] = useState<Scout[]>(initialScouts);

  const handleStatusChange = async (scoutId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/scouts/${scoutId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: enabled ? "ACTIVE" : "INACTIVE",
        }),
      });

      if (!response.ok) throw new Error("Failed to update scout status");

      setScouts((current) =>
        current.map((scout) =>
          scout.id === scoutId
            ? { ...scout, status: enabled ? "ACTIVE" : "INACTIVE" }
            : scout
        )
      );
    } catch (error) {
      console.error("Error updating scout status:", error);
    }
  };

  if (scouts.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium">No Scouts Created</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create your first scout to start monitoring the market for signals.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {scouts.map((scout) => (
        <Card key={scout.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">{scout.name}</h3>
              <p className="text-sm text-muted-foreground">
                {scout.description || "No description"}
              </p>
            </div>
            <ScoutActions
              scout={scout}
              onScoutDeleted={(id) => {
                setScouts((current) => current.filter((s) => s.id !== id));
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge
                variant={scout.status === "ACTIVE" ? "default" : "secondary"}
              >
                {scout.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Strategy</span>
              <span className="text-sm">{scout.strategy}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Symbols</span>
              <span className="text-sm">{scout.symbols.join(", ")}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tier</span>
              <Badge variant="outline">{scout.tier}</Badge>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={scout.status === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    handleStatusChange(scout.id, checked)
                  }
                />
                <label className="text-sm font-medium">
                  {scout.status === "ACTIVE" ? "Active" : "Inactive"}
                </label>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
