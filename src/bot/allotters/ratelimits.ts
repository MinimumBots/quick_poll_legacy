import cron from 'node-cron';

export default class RateLimits {
  readonly resetTiming = '0 * * * *';
  private counts: { [id: string]: number } = {};

  constructor(readonly limit: number) {
    cron.schedule(this.resetTiming, () => this.allReset());
  }

  remaining(id: string): number {
    return this.limit - (this.counts[id] ?? 0);
  }

  addition(id: string): boolean {
    this.counts[id] ??= 0;
    this.counts[id]++;
    return !!this.remaining(id);
  }

  reset(id: string): boolean {
    return delete this.counts[id];
  }

  allReset(): void {
    this.counts = {};
  }
}
