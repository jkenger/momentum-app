// components/learn/basic-chart.tsx
"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface BasicChartProps {
  type:
    | "candlestick"
    | "market-order"
    | "limit-order"
    | "long-position"
    | "short-position";
}

export function BasicChart({ type }: BasicChartProps) {
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
      height: 300,
    });

    // Generate data based on chart type
    const data = generateChartData(type);

    if (type === "candlestick") {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      candlestickSeries.setData(data);
    } else {
      const lineSeries = chart.addLineSeries({
        color: type.includes("long") ? "#26a69a" : "#ef5350",
        lineWidth: 2,
      });
      lineSeries.setData(data);

      // Add markers for entry/exit points
      if (
        [
          "market-order",
          "limit-order",
          "long-position",
          "short-position",
        ].includes(type)
      ) {
        addTradeMarkers(lineSeries, type);
      }
    }

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

  return <div ref={chartContainerRef} />;
}

function generateChartData(type: string) {
  const basePrice = 100;
  const data = [];
  const points = 50;

  for (let i = 0; i < points; i++) {
    const time = new Date(2024, 0, i + 1).getTime() / 1000;

    if (type === "candlestick") {
      const volatility = Math.random() * 2;
      const open = basePrice + Math.sin(i / 10) * 10;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();

      data.push({
        time,
        open,
        high,
        low,
        close,
      });
    } else {
      let value = basePrice;

      switch (type) {
        case "long-position":
          value += Math.sin((i / points) * Math.PI) * 15;
          break;
        case "short-position":
          value -= Math.sin((i / points) * Math.PI) * 15;
          break;
        default:
          value += Math.sin(i / 10) * 10;
      }

      data.push({
        time,
        value,
      });
    }
  }

  return data;
}

function addTradeMarkers(series: any, type: string) {
  // Add entry and exit markers based on type
  const markers = [];

  if (type === "market-order") {
    markers.push({
      time: new Date(2024, 0, 25).getTime() / 1000,
      position: "belowBar",
      color: "#26a69a",
      shape: "circle",
      text: "Market Buy",
    });
  } else if (type === "limit-order") {
    markers.push({
      time: new Date(2024, 0, 25).getTime() / 1000,
      position: "belowBar",
      color: "#26a69a",
      shape: "circle",
      text: "Limit Buy",
    });
  } else if (type === "long-position") {
    markers.push(
      {
        time: new Date(2024, 0, 10).getTime() / 1000,
        position: "belowBar",
        color: "#26a69a",
        shape: "circle",
        text: "Buy",
      },
      {
        time: new Date(2024, 0, 40).getTime() / 1000,
        position: "aboveBar",
        color: "#26a69a",
        shape: "circle",
        text: "Sell",
      }
    );
  } else if (type === "short-position") {
    markers.push(
      {
        time: new Date(2024, 0, 10).getTime() / 1000,
        position: "aboveBar",
        color: "#ef5350",
        shape: "circle",
        text: "Sell",
      },
      {
        time: new Date(2024, 0, 40).getTime() / 1000,
        position: "belowBar",
        color: "#ef5350",
        shape: "circle",
        text: "Buy",
      }
    );
  }

  series.setMarkers(markers);
}
