import { Client } from 'discord.js';

import { BOT_INTENTS, PRESENCE_UPDATE_INTERVAL } from '../constants';
import { Utils } from './utils';

import { Admin } from './listeners/admin';
import { Decrypter } from './listeners/decrypter';
import { Allocater } from './allotters/allocater';

const bot = new Client({
  messageCacheMaxSize: 500,
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  restTimeOffset: 100,
  retryLimit: 3,
  ws: { intents: BOT_INTENTS },
  presence: { status: 'dnd', activity: { type: 'PLAYING', name: '再接続' } },
});

function initialize(): void {
  Admin.initialize(bot);
  Decrypter.initialize(bot);
  Allocater.initialize(bot);
}

let presenceCount = 0;
bot.setInterval(() => {
  Utils.updatePresence(bot, presenceCount++)
    .catch(console.error);
}, PRESENCE_UPDATE_INTERVAL);

bot.on('ready', () => initialize());
bot.on('shardReady', shardID => console.info(`Shard No.${shardID} is ready.`));

bot.login(process.env['QUICK_POLL_TOKEN'])
  .catch(console.error);
