import { Client, Snowflake } from 'discord.js';

import { BOT_INTENTS, PRESENCE_UPDATE_INTERVAL } from '../constants';
import { Utils } from './utils';

import { Admin } from './listeners/admin';
import { Decrypter } from './listeners/decrypter';
import { Allocater } from './allotters/allocater';
import { Judge } from './listeners/judge';

const bot = new Client({
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  restTimeOffset: 100,
  retryLimit: 3,
  ws: { intents: BOT_INTENTS },
  presence: { status: 'dnd', activity: { type: 'PLAYING', name: '再接続' } },
});

function initialize(botID: Snowflake): void {
  Admin.initialize(bot);
  Decrypter.initialize(bot, botID);
  Allocater.initialize(bot, botID);
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
