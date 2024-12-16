// components/signals/signals-container.tsx
"use client";

import { useState } from "react";
import { Signal } from "@prisma/client";
import { SignalList } from "./signal-list";
import { SignalDetails } from "./signal-details";
import { useSession } from "next-auth/react";
import { useSignalUpdates } from "@/hooks/use-signal-updates";

interface SignalsContainerProps {
  initialSignals: Signal[];
}

export function SignalsContainer({ initialSignals }: SignalsContainerProps) {
  const { data: session, status } = useSession();
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const signals = useSignalUpdates(initialSignals, session?.user?.id);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Signals</h2>
          <span className="text-sm text-muted-foreground">
            {signals.length} signals
          </span>
        </div>
        <SignalList signals={signals} onSelectSignal={setSelectedSignal} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Signal Details</h2>
        {selectedSignal ? (
          <SignalDetails signal={selectedSignal} />
        ) : (
          <p className="text-muted-foreground">
            Select a signal to view details
          </p>
        )}
      </div>
    </div>
  );
}
