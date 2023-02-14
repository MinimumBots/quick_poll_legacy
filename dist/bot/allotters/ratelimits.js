"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class RateLimits {
    limit;
    resetTiming = '0 * * * *';
    counts = {};
    constructor(limit) {
        this.limit = limit;
        node_cron_1.default.schedule(this.resetTiming, () => this.allReset());
    }
    remaining(id) {
        return this.limit - (this.counts[id] ?? 0);
    }
    addition(id) {
        this.counts[id] ??= 0;
        this.counts[id]++;
        return this.remaining(id) >= 0;
    }
    reset(id) {
        return delete this.counts[id];
    }
    allReset() {
        this.counts = {};
    }
}
exports.default = RateLimits;
