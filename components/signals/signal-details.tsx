// components/signals/signal-details.tsx
"use client";

import { Signal } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

interface SignalDetailsProps {
  signal: Signal;
}

export function SignalDetails({ signal }: SignalDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{signal.symbol}</CardTitle>
          <Badge>{signal.status}</Badge>
        </div>
        <CardDescription>
          Signal generated{" "}
          {formatDistance(new Date(signal.createdAt), new Date())} ago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Entry Price</p>
            <p className="text-2xl">${signal.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Stop Loss</p>
            <p className="text-2xl text-destructive">
              ${signal.stopLoss.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Take Profit Targets</p>
          <div className="space-y-2">
            {signal.targetPrice.map((target, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-accent/50 rounded"
              >
                <span>Target {index + 1}</span>
                <span className="text-green-500">${target.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {signal.indicators && (
          <div>
            <p className="text-sm font-medium mb-2">Technical Indicators</p>
            <pre className="p-2 bg-muted rounded text-sm overflow-auto">
              {JSON.stringify(signal.indicators, null, 2)}
            </pre>
          </div>
        )}

        {signal.notes && (
          <div>
            <p className="text-sm font-medium mb-2">Notes</p>
            <p className="text-sm text-muted-foreground">{signal.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
