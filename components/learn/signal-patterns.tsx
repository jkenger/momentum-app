// components/learn/signal-patterns.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import { useEffect, useRef } from "react";

interface SignalPatternProps {
  type: "bullish" | "bearish";
  className?: string;
}

export function SignalPattern({ type, className }: SignalPatternProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#99A1B3",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 200,
    });

    const series = chart.addLineSeries({
      color: type === "bullish" ? "#26a69a" : "#ef5350",
      lineWidth: 2,
    });

    // Generate pattern data
    const data = generatePatternData(type);
    series.setData(data);

    // Add EMAs
    const ema20Series = chart.addLineSeries({
      color: "#2962FF",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      title: "EMA 20",
    });

    const ema50Series = chart.addLineSeries({
      color: "#FF6B6B",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      title: "EMA 50",
    });

    ema20Series.setData(generateEMAData(data, type, "fast"));
    ema50Series.setData(generateEMAData(data, type, "slow"));

    // Responsive handling
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [type]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          {type === "bullish"
            ? "Bullish Signal Pattern"
            : "Bearish Signal Pattern"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} />
      </CardContent>
    </Card>
  );
}

// Helper functions
function generatePatternData(type: "bullish" | "bearish") {
  let data;
  const points = 50;
  const baseValue = 100;

  for (let i = 0; i < points; i++) {
    const time = new Date(2024, 0, i + 1).getTime() / 1000;
    let value;

    if (type === "bullish") {
      // Create a rising pattern
      value = baseValue + (i / points) * 20 + Math.sin(i / 5) * 2;
    } else {
      // Create a falling pattern
      value = baseValue + 20 - (i / points) * 20 + Math.sin(i / 5) * 2;
    }

    data.push({
      time,
      value,
    });
  }

  return data;
}

function generateEMAData(
  data,
  type: "bullish" | "bearish",
  emaType: "fast" | "slow"
) {
  return data.map((point, i) => {
    const offset = emaType === "fast" ? 1 : 2;
    const trend = type === "bullish" ? 1 : -1;

    return {
      time: point.time,
      value: point.value + trend * offset + Math.sin(i / 8) * 0.5,
    };
  });
}
