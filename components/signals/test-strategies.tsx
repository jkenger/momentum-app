// components/signals/test-strategies.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AUTOMATED_STRATEGIES = [
  { value: "EMA_CROSSOVER", label: "EMA Crossover (20/50)" },
  { value: "RSI_DIVERGENCE", label: "RSI Divergence" },
  { value: "SUPPORT_RESISTANCE", label: "Support/Resistance" },
  { value: "VOLUME_BREAKOUT", label: "Volume Breakout" },
  { value: "TREND_FOLLOWING", label: "Trend Following" },
];

const MANUAL_STRATEGIES = [
  { value: "PRICE_ACTION", label: "Price Action" },
  { value: "CHART_PATTERN", label: "Chart Pattern" },
  { value: "FUNDAMENTAL", label: "Fundamental" },
  { value: "NEWS_EVENT", label: "News Event" },
  { value: "CUSTOM", label: "Custom" },
];

export function TestStrategies() {
  const [loading, setLoading] = useState(false);
  const [selectedAutomated, setSelectedAutomated] = useState<string>();
  const [selectedManual, setSelectedManual] = useState<string>();
  const { toast } = useToast();

  const testAutomatedStrategy = async () => {
    if (!selectedAutomated) return;

    setLoading(true);
    try {
      const response = await fetch("/api/signals/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: selectedAutomated,
          symbol: "BTC/USDT",
        }),
      });

      const data = await response.json();

      if (data.signal) {
        toast({
          title: "Signal Generated",
          description: `${selectedAutomated} strategy generated a ${data.signal.direction} signal`,
        });
      } else {
        toast({
          title: "No Signal",
          description: "Conditions not met for signal generation",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test strategy, " + error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testManualStrategy = async () => {
    if (!selectedManual) return;

    setLoading(true);
    try {
      await fetch("/api/signals/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedManual,
          symbol: "BTC/USDT",
          // Add test data for manual signal
          direction: "LONG",
          entryPrice: 42000,
          targetPrice: [43000, 44000],
          stopLoss: 41000,
          confidence: 80,
        }),
      });

      toast({
        title: "Manual Signal Created",
        description: `Created ${selectedManual} signal`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create manual signal, " + error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Automated Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Strategies</CardTitle>
          <CardDescription>
            Test automated signal generation strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedAutomated}
            onValueChange={setSelectedAutomated}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {AUTOMATED_STRATEGIES.map((strategy) => (
                <SelectItem key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button
            onClick={testAutomatedStrategy}
            disabled={!selectedAutomated || loading}
          >
            {loading ? "Testing..." : "Test Strategy"}
          </Button>
        </CardFooter>
      </Card>

      {/* Manual Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Strategies</CardTitle>
          <CardDescription>
            Test manual signal creation with different types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedManual} onValueChange={setSelectedManual}>
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {MANUAL_STRATEGIES.map((strategy) => (
                <SelectItem key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <Button
            onClick={testManualStrategy}
            disabled={!selectedManual || loading}
          >
            {loading ? "Creating..." : "Create Signal"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
