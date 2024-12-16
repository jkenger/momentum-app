// components/signals/detect-signal-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Scan } from "lucide-react";
import { logger } from "@/lib/utils";

export function DetectSignalButton() {
  const [loading, setLoading] = useState(false);

  const detectSignals = async () => {
    try {
      setLoading(true);
      logger.log("Starting signal detection", "info");

      const response = await fetch("/api/signals/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol: "BTC/USDT" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to detect signals");
      }

      if (data.message === "No signal generated") {
        logger.log("No signals detected", "warning");
      } else if (data.signal) {
        logger.log("New signal detected", "success", {
          type: "signal",
          ...data.signal,
        });
      }
    } catch (error) {
      logger.log("Signal detection failed", "error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="default" onClick={detectSignals} disabled={loading}>
      <Scan className="w-4 h-4 mr-2" />
      {loading ? "Scanning..." : "Scan for Signals"}
    </Button>
  );
}
