// components/learn/ema-diagram.tsx
"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface EmaChartProps {
  className?: string;
}

export function EmaChart({ className }: EmaChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#99A1B3",
      },
      grid: {
        vertLines: { color: "#2D3138" },
        horzLines: { color: "#2D3138" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Generate sample data
    const baselineData = generateSampleData();
    const ema20Data = calculateEMA(baselineData, 20);
    const ema50Data = calculateEMA(baselineData, 50);

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
    });
    candlestickSeries.setData(baselineData);

    // Add EMA series
    const ema20Series = chart.addLineSeries({
      color: "#2962FF",
      lineWidth: 2,
      title: "EMA 20",
    });
    ema20Series.setData(ema20Data);

    const ema50Series = chart.addLineSeries({
      color: "#FF6B6B",
      lineWidth: 2,
      title: "EMA 50",
    });
    ema50Series.setData(ema50Data);

    // Highlight crossover points
    const crossovers = findCrossovers(ema20Data, ema50Data);
    crossovers.forEach((crossover) => {
      const marker = {
        time: crossover.time,
        position: crossover.type === "bullish" ? "belowBar" : "aboveBar",
        color: crossover.type === "bullish" ? "#26a69a" : "#ef5350",
        shape: "circle",
        text: crossover.type === "bullish" ? "↑" : "↓",
      };
      candlestickSeries.setMarkers([marker]);
    });

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
  }, []);

  return (
    <div className={className}>
      <div ref={chartContainerRef} />
    </div>
  );
}

// Helper functions
function generateSampleData() {
  const basePrice = 100;
  const data = [];
  let lastClose = basePrice;

  for (let i = 0; i < 100; i++) {
    const time = new Date(2024, 0, i + 1).getTime() / 1000;

    // Create some trend and volatility
    const trend = Math.sin(i / 10) * 10;
    const volatility = (Math.random() - 0.5) * 4;

    const open = lastClose;
    const close = basePrice + trend + volatility;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    data.push({
      time,
      open,
      high,
      low,
      close,
    });

    lastClose = close;
  }

  return data;
}

function calculateEMA(data: any[], period: number) {
  const multiplier = 2 / (period + 1);
  const emaData = [];

  // Initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let prevEma = sum / period;

  for (let i = 0; i < data.length; i++) {
    const currentPrice = data[i].close;
    const ema = (currentPrice - prevEma) * multiplier + prevEma;
    emaData.push({
      time: data[i].time,
      value: ema,
    });
    prevEma = ema;
  }

  return emaData;
}

function findCrossovers(ema20Data: any[], ema50Data: any[]) {
  const crossovers = [];

  for (let i = 1; i < ema20Data.length; i++) {
    const prev20 = ema20Data[i - 1].value;
    const curr20 = ema20Data[i].value;
    const prev50 = ema50Data[i - 1].value;
    const curr50 = ema50Data[i].value;

    if (prev20 <= prev50 && curr20 > curr50) {
      crossovers.push({
        time: ema20Data[i].time,
        type: "bullish",
      });
    } else if (prev20 >= prev50 && curr20 < curr50) {
      crossovers.push({
        time: ema20Data[i].time,
        type: "bearish",
      });
    }
  }

  return crossovers;
}
