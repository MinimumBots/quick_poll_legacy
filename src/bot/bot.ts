import { Client, LimitedCollection, Options, Snowflake } from 'discord.js';

import {
  BOT_INTENTS,
  MESSAGE_CACHE_LIFETIME,
  MESSAGE_SWEEP_INTERVAL,
  PRESENCE_UPDATE_INTERVAL,
} from '../constants';
import { Utils } from './utils';

import { Health } from '../transactions/health';

import { Decrypter } from './listeners/decrypter';
import { Allocater } from './allotters/allocater';
import { Judge } from './listeners/judge';
import { Session } from './allotters/session';

const makeCache = Options.cacheWithLimits({
  ...Options.defaultMakeCacheSettings,
  MessageManager: {
    sweepInterval: MESSAGE_SWEEP_INTERVAL,
    sweepFilter: LimitedCollection.filterByLifetime({ lifetime: MESSAGE_CACHE_LIFETIME }),
  },
}); 

const bot = new Client({
  makeCache: makeCache,
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  restTimeOffset: 100,
  retryLimit: 3,
  intents: BOT_INTENTS,
  presence: { status: 'dnd', activities: [{ type: 'PLAYING', name: '再接続' }] },
});

function initialize(botID: Snowflake): void {
  Health.initialize(bot);
  Decrypter.initialize(bot, botID);
  Allocater.initialize(bot, botID);
  Session.initialize(bot);
  Judge.initialize(bot, botID);
}

let presenceCount = 0;
setInterval(() => {
  Utils.updatePresence(bot, presenceCount++)
    .catch(console.error);
}, PRESENCE_UPDATE_INTERVAL);

bot.on('ready', bot => {
  initialize(bot.application.id);
});
bot.on('shardReady', shardID => console.info(`Shard No.${shardID} is ready.`));

bot.login(process.env['QUICK_POLL_TOKEN'])
  .catch(console.error);

process.on('exit', () => bot.destroy());
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => process.exit(0));
