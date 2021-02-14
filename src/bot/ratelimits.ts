import { Snowflake } from 'discord.js';
import cron from 'node-cron';

import {
  RATE_RESET_SCHEDULE,
  USER_RATE_LIMIT,
  BOT_RATE_LIMIT,
  WEBHOOK_RATE_LIMIT
} from './constants';

const timezone = 'Asia/Tokyo'; 

export const UsersRateLimit: {
  readonly limit: number;
  counts: { [userID: string]: number };
  remaining(userID: Snowflake): number;
  addition(userID: Snowflake): number;
  reset(userID: Snowflake): void;
  allReset(): void;
} = {
  limit: USER_RATE_LIMIT,
  counts: {},
  remaining(userID) {
    return this.limit - (this.counts[userID] ?? 0);
  },
  addition(userID) {
    this.counts[userID] ??= 0;
    this.counts[userID]++;
    return this.remaining(userID);
  },
  reset(userID) {
    delete this.counts[userID];
  },
  allReset() {
    this.counts = {};
  }
};

cron.schedule(RATE_RESET_SCHEDULE, UsersRateLimit.allReset, { timezone });

export const BotsRateLimit: {
  readonly limit: number;
  counts: {
    [botID: string]: {
      [guildID: string]: number
    }
  }
  remaining(botID: Snowflake, guildID: Snowflake): number;
  addition(botID: Snowflake, guildID: Snowflake): number;
  reset(botID: Snowflake, guildID: Snowflake): void;
  allReset(): void;
} = {
  limit: BOT_RATE_LIMIT,
  counts: {},
  remaining(botID, guildID) {
    return this.limit - (this.counts[botID][guildID] ?? 0);
  },
  addition(botID, guildID) {
    this.counts[botID][guildID] ??= 0;
    this.counts[botID][guildID]++;
    return this.remaining(botID, guildID);
  },
  reset(botID, guildID) {
    delete this.counts[botID][guildID];
  },
  allReset() {
    this.counts = {};
  }
};

cron.schedule(RATE_RESET_SCHEDULE, BotsRateLimit.allReset, { timezone });

export const WebhooksRateLimit: {
  readonly limit: number;
  counts: { [guildID: string]: number };
  remaining(guildID: Snowflake): number;
  addition(guild: Snowflake): number;
  reset(guildID: Snowflake): void;
  allReset(): void;
} = {
  limit: WEBHOOK_RATE_LIMIT,
  counts: {},
  remaining(guildID) {
    return this.limit - (this.counts[guildID] ?? 0);
  },
  addition(guildID) {
    this.counts[guildID] ??= 0;
    this.counts[guildID]++;
    return this.remaining(guildID);
  },
  reset(guildID) {
    delete this.counts[guildID];
  },
  allReset() {
    this.counts = {};
  }
};

cron.schedule(RATE_RESET_SCHEDULE, WebhooksRateLimit.allReset, { timezone });
