import cron from 'node-cron';

export default class RateLimits {
  readonly timezone = 'Asia/Tokyo';
  private counts: { [id: string]: number } = {};

  constructor(readonly limit: number, readonly schedule: string) {
    cron.schedule(schedule, () => this.allReset(), { timezone: this.timezone });
  }

  remaining(id: string): number {
    return this.limit - (this.counts[id] ?? 0);
  }

  addition(id: string): boolean {
    this.counts[id] ??= 0;
    this.counts[id]++;
    return !!this.remaining(id);
  }

  reset(id: string): void {
    delete this.counts[id];
  }

  allReset(): void {
    this.counts = {};
  }
}
