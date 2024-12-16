import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type LogLevel = "info" | "success" | "warning" | "error";

export const logger = {
  formatSignal: (signal: any) => {
    const formattedSignal = {
      id: signal.id,
      symbol: signal.symbol,
      type: signal.type,
      direction: signal.direction,
      entry: `$${signal.entryPrice.toFixed(2)}`,
      targets: signal.targetPrice.map((t: number) => `$${t.toFixed(2)}`),
      stopLoss: `$${signal.stopLoss.toFixed(2)}`,
      confidence: `${signal.confidence}%`,
      status: signal.status,
      createdAt: new Date(signal.createdAt).toLocaleString(),
    };

    console.group("📊 Signal Details");
    Object.entries(formattedSignal).forEach(([key, value]) => {
      console.log(
        `%c${key.padEnd(10)}: %c${value}`,
        "color: #888",
        "color: #fff; font-weight: bold"
      );
    });

    console.group("📈 Technical Indicators");
    Object.entries(signal.indicators || {}).forEach(([key, value]) => {
      console.log(
        `%c${key.padEnd(10)}: %c${value}`,
        "color: #888",
        "color: #2ecc71"
      );
    });
    console.groupEnd();
    console.groupEnd();
  },

  log: (message: string, level: LogLevel = "info", data?: any) => {
    const styles = {
      info: "color: #3498db",
      success: "color: #2ecc71",
      warning: "color: #f1c40f",
      error: "color: #e74c3c",
    };

    const icons = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };

    console.log(
      `%c${icons[level]} ${message}`,
      `${styles[level]}; font-weight: bold;`
    );

    if (data) {
      if (data.type === "signal") {
        logger.formatSignal(data);
      } else {
        console.log(data);
      }
    }
  },
};
