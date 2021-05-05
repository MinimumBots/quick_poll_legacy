import { Client, Snowflake } from 'discord.js';

import {
  BOT_INTENTS,
  MESSAGE_CACHE_LIFETIME,
  MESSAGE_SWEEP_INTERVAL,
  PRESENCE_UPDATE_INTERVAL,
} from '../constants';
import { Utils } from './utils';

import { Health } from '../transactions/health';

import { Admin } from './listeners/admin';
import { Decrypter } from './listeners/decrypter';
import { Allocater } from './allotters/allocater';
import { Judge } from './listeners/judge';
import { Session } from './allotters/session';

const bot = new Client({
  messageCacheLifetime: MESSAGE_CACHE_LIFETIME,
  messageSweepInterval: MESSAGE_SWEEP_INTERVAL,
  messageEditHistoryMaxSize: 0,
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  restTimeOffset: 100,
  retryLimit: 3,
  ws: { intents: BOT_INTENTS },
  presence: { status: 'dnd', activity: { type: 'PLAYING', name: '再接続' } },
});

function initialize(botID: Snowflake): void {
  Health.initialize(bot);
  Admin.initialize(bot);
  Decrypter.initialize(bot, botID);
  Allocater.initialize(bot, botID);
  Session.initialize(bot);
  Judge.initialize(bot, botID);
}

let presenceCount = 0;
bot.setInterval(() => {
  Utils.updatePresence(bot, presenceCount++)
    .catch(console.error);
}, PRESENCE_UPDATE_INTERVAL);

bot.on('ready', () => {
  bot.fetchApplication()
    .then(app => initialize(app.id))
    .catch(console.error);
});
bot.on('shardReady', shardID => console.info(`Shard No.${shardID} is ready.`));

bot.login(process.env['QUICK_POLL_TOKEN'])
  .catch(console.error);

process.on('exit', () => bot.destroy());
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => process.exit(0));
