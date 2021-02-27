import { ActivityType, Client } from 'discord.js';

import { BOT_INTENTS, PRESENCE_UPDATE_INTERVAL } from './constants';
import { Allocater } from './allotters/allocater';
import { Admin } from './listeners/admin';
import { Decrypter } from './listeners/decrypter';

const bot = new Client({
  messageCacheMaxSize: 500,
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  restTimeOffset: 100,
  retryLimit: 3,
  ws: { intents: BOT_INTENTS },
  presence: { status: 'dnd', activity: { type: 'COMPETING', name: '再接続' } },
});

function initialize(): void {
  Admin.initialize(bot);
  Decrypter.initialize(bot);
  Allocater.initialize(bot);
}

async function fetchGuildCount(): Promise<string> {
  const counts = await bot.shard?.fetchClientValues('guilds.cache.size');
  const count = counts?.reduce((a, b) => a + b, 0);
  return typeof count === 'number' && count > 0 ? `${count}` : 'いくつかの';
}

async function updatePresence(count: number): Promise<void> {
  let type: ActivityType, name: string;

  switch (count % 2) {
    case 1:
      type = 'WATCHING';
      name = `${await fetchGuildCount()} サーバー`;
      break;

    default:
      type = 'PLAYING';
      name = '/poll | /expoll';
      break;
  }

  await bot.user?.setPresence({ status: 'online', activity: { type, name } });
}

let presenceCount = 0;
bot.setInterval(() => {
  updatePresence(presenceCount++)
    .catch(console.error);
}, PRESENCE_UPDATE_INTERVAL);

bot.on('ready', () => initialize());

bot.login(process.env['QUICK_POLL_TOKEN'])
  .catch(console.error);
