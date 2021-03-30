"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
class RateLimits {
    constructor(limit) {
        this.limit = limit;
        this.resetTiming = '0 * * * *';
        this.counts = {};
        node_cron_1.default.schedule(this.resetTiming, () => this.allReset());
    }
    remaining(id) {
        return this.limit - (this.counts[id] ?? 0);
    }
    addition(id) {
        var _a;
        (_a = this.counts)[id] ?? (_a[id] = 0);
        this.counts[id]++;
        return !!this.remaining(id);
    }
    reset(id) {
        return delete this.counts[id];
    }
    allReset() {
        this.counts = {};
    }
}
exports.default = RateLimits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZWxpbWl0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvYWxsb3R0ZXJzL3JhdGVsaW1pdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBNkI7QUFFN0IsTUFBcUIsVUFBVTtJQUk3QixZQUFxQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUh6QixnQkFBVyxHQUFHLFdBQVcsQ0FBQztRQUMzQixXQUFNLEdBQTZCLEVBQUUsQ0FBQztRQUc1QyxtQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxTQUFTLENBQUMsRUFBVTtRQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBVTs7UUFDakIsTUFBQSxJQUFJLENBQUMsTUFBTSxFQUFDLEVBQUUsU0FBRixFQUFFLElBQU0sQ0FBQyxFQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBVTtRQUNkLE9BQU8sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBekJELDZCQXlCQyJ9