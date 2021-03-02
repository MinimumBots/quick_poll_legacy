import { ShardingManager } from 'discord.js';
import { BOT_TOTAL_SHARDS } from './constants';

const totalShards = BOT_TOTAL_SHARDS;

const manager = new ShardingManager('./dist/bot/bot.js', {
  token: process.env['QUICK_POLL_TOKEN'],
  totalShards: totalShards
});

manager.on('shardCreate', shard => {
  console.info(`Spawned shard ${shard.id + 1}/${manager.totalShards}.`);
});

console.info('Start spawning shards.');
manager.spawn()
  .then(() => console.info('All shards were successfully spawned.'))
  .catch(console.error);
