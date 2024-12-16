// hooks/use-signal-updates.ts
"use client";

import { useState, useEffect } from "react";
import { Signal } from "@prisma/client";
import { useToast } from "./use-toast";

export function useSignalUpdates(initialSignals: Signal[], userId?: string) {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource("/api/signals/stream");

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new-signal") {
          setSignals((prev) => [data.signal, ...prev]);
          // Toast
          console.log(data.signal);
          toast({
            title: "Signal Generated",
            description: `${data.signal.type} strategy generated a ${data.signal.direction} signal`,
          });
        } else if (data.type === "update-signal") {
          setSignals((prev) =>
            prev.map((signal) =>
              signal.id === data.signal.id ? data.signal : signal
            )
          );
          toast({
            title: "Signal Updated",
            description: `${data.signal.type} strategy updated a ${data.signal.direction} signal`,
          });
        } else if (data.type === "delete-signal") {
          setSignals((prev) =>
            prev.filter((signal) => signal.id !== data.signalId)
          );
          toast({
            title: "Signal Deleted",
            description: "Signal deleted successfully",
          });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  return signals;
}
