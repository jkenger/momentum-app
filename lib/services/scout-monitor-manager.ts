// lib/services/scout-monitor-manager.ts
import { Scout } from "@prisma/client";
import { ScoutMonitor } from "./scout-monitor";

class ScoutMonitorManager {
  private static instance: ScoutMonitor | null = null;
  private static activeScouts = new Set<string>();

  static getInstance(): ScoutMonitor {
    if (!this.instance) {
      this.instance = new ScoutMonitor();
    }
    return this.instance;
  }

  static async startScout(scout: Scout) {
    const monitor = this.getInstance();
    this.activeScouts.add(scout.id);
    await monitor.startScout(scout);
  }

  static async stopScout(scoutId: string) {
    if (!this.instance) return;
    this.activeScouts.delete(scoutId);
    await this.instance.stopScout(scoutId);
  }

  static getActiveScouts() {
    return Array.from(this.activeScouts);
  }

  static cleanup() {
    if (this.instance) {
      Array.from(this.activeScouts).forEach((id) => {
        this.instance?.stopScout(id);
      });
      this.activeScouts.clear();
      this.instance = null;
    }
  }
}

export default ScoutMonitorManager;
