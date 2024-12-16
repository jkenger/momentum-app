// components/signals/signal-list.tsx
"use client";

import { Signal } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

interface SignalListProps {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
}

export function SignalList({ signals, onSelectSignal }: SignalListProps) {
  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <Card
          key={signal.id}
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onSelectSignal(signal)}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{signal.symbol}</span>
                <Badge
                  variant={
                    signal.direction === "LONG" ? "default" : "destructive"
                  }
                >
                  {signal.direction === "LONG" ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {signal.direction}
                </Badge>
                <Badge variant="outline">{signal.timeframe}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Entry: ${signal.entryPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {signal.confidence.toFixed(1)}% confidence
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(signal.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
