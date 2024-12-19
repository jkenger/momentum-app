// components/scouts/create-scout-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const createScoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  tier: z.enum(["BASIC", "PRO", "ELITE"]),
  strategy: z.enum([
    "EMA_CROSSOVER",
    "RSI_DIVERGENCE",
    "SUPPORT_RESISTANCE",
    "VOLUME_BREAKOUT",
  ]),
  symbols: z.string().min(1, "At least one symbol is required"),
  interval: z.string().min(1, "Interval is required"),
});

const defaultValues: Partial<z.infer<typeof createScoutSchema>> = {
  tier: "BASIC",
  strategy: "EMA_CROSSOVER",
  interval: "15s",
};

const strategyDescriptions = {
  EMA_CROSSOVER: "Uses moving average crossovers to identify trend changes",
  RSI_DIVERGENCE:
    "Detects divergences between price and RSI for potential reversals",
  SUPPORT_RESISTANCE:
    "Identifies key support and resistance levels for breakouts",
  VOLUME_BREAKOUT: "Monitors volume spikes with price movements for breakouts",
};

const intervalOptions = [
  { value: "15s", label: "15 seconds" },
  { value: "1m", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
];

export function CreateScoutForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createScoutSchema>>({
    resolver: zodResolver(createScoutSchema),
    defaultValues,
  });

  const watchStrategy = form.watch("strategy");

  async function onSubmit(values: z.infer<typeof createScoutSchema>) {
    try {
      setLoading(true);

      const response = await fetch("/api/scouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          symbols: values.symbols.split(",").map((s) => s.trim()),
        }),
      });

      if (!response.ok) throw new Error("Failed to create scout");

      router.refresh();
      router.push("/scouts");
    } catch (error) {
      console.error("Error creating scout:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My EMA Scout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of your scout's purpose..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scout Tier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BASIC">Basic Scout</SelectItem>
                  <SelectItem value="PRO">Pro Scout</SelectItem>
                  <SelectItem value="ELITE">Elite Scout</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EMA_CROSSOVER">EMA Crossover</SelectItem>
                  <SelectItem value="RSI_DIVERGENCE">RSI Divergence</SelectItem>
                  <SelectItem value="SUPPORT_RESISTANCE">
                    Support/Resistance
                  </SelectItem>
                  <SelectItem value="VOLUME_BREAKOUT">
                    Volume Breakout
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {
                  strategyDescriptions[
                    watchStrategy as keyof typeof strategyDescriptions
                  ]
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symbols"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trading Pairs</FormLabel>
              <FormControl>
                <Input placeholder="BTC/USDT, ETH/USDT" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of trading pairs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scan Interval</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {intervalOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                How often the scout will analyze the market
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Scout will start in inactive state. You can activate it after
            creation.
          </AlertDescription>
        </Alert>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Scout..." : "Create Scout"}
        </Button>
      </form>
    </Form>
  );
}
