// components/signals/test-signal-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function TestSignalButton() {
  const [loading, setLoading] = useState(false);

  const createTestSignal = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/test/signal", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create test signal");
      }

      const signal = await response.json();
      console.log("Created test signal:", signal);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={createTestSignal} disabled={loading}>
      {loading ? "Creating..." : "Create Test Signal"}
    </Button>
  );
}
