import { ShardingManager } from 'discord.js';
import { BOT_SHARD_LIST, BOT_TOTAL_SHARDS } from './constants';

const manager = new ShardingManager('./dist/bot/bot.js', {
  token: process.env['QUICK_POLL_TOKEN'],
  totalShards: BOT_TOTAL_SHARDS,
  shardList: BOT_SHARD_LIST,
});

manager.on('shardCreate', shard => {
  console.info(`Spawned shard ${shard.id + 1}/${manager.totalShards}.`);
});

console.info('Start spawning shards.');
manager.spawn({ timeout: -1 })
  .then(() => console.info('All shards were successfully spawned.'))
  .catch(console.error);
