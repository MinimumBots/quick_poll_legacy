import { ActivityType, Client, Options, Partials } from 'discord.js';

import { BOT_INTENTS, PRESENCE_UPDATE_INTERVAL } from '../constants';
import { Utils } from './utils';

import { Health } from '../transactions/health';

import { Decrypter } from './listeners/decrypter';
import { Allocater } from './allotters/allocater';
import { Judge } from './listeners/judge';
import { Session } from './allotters/session';

const makeCache = Options.cacheWithLimits({
  ...Options.DefaultMakeCacheSettings,
  MessageManager: {
    maxSize: 200,
    keepOverLimit: Judge.adjustCache,
  },
}); 

const bot = new Client({
  makeCache: makeCache,
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.GuildScheduledEvent,
  ],
  rest: {
    offset: 100,
  },
  intents: BOT_INTENTS,
  presence: { status: 'dnd', activities: [{ type: ActivityType.Playing, name: '再接続' }] },
});

function initialize(bot: Client<true>): void {
  const botId = bot.application.id;

  Health.initialize(bot);
  Decrypter.initialize(bot);
  Allocater.initialize(bot);
  Session.initialize(bot);
  Judge.initialize(bot);
}

let presenceCount = 0;
setInterval(() => {
  Utils.updatePresence(bot, presenceCount++)
    .catch(console.error);
}, PRESENCE_UPDATE_INTERVAL);

bot
  .on('ready', bot => initialize(bot))
  .on('shardReady', shardId => console.info(`Shard No.${shardId} is ready.`));

bot.login(process.env['QUICK_POLL_TOKEN'])
  .catch(console.error);

['SIGTERM', 'SIGINT']
  .forEach(signal => process.on(signal, () => {
    bot.destroy();
    process.exit(0);
  }));
