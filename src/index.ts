import { ShardingManager } from 'discord.js';

const totalShards
  = process.env['TOTAL_SHARDS'] ? Number(process.env['TOTAL_SHARDS']) : 'auto';
const manager = new ShardingManager('./dist/bot/bot.js', {
  token: process.env['QUICK_POLL_TOKEN'],
  totalShards: totalShards
});

manager.on('shardCreate', shard => {
  console.info(`Launched shard ${shard.id + 1}/${manager.totalShards}.`);
});

console.info('Start launching shards.');
manager.spawn()
  .then(() => console.info('All shards were successfully launched.'))
  .catch(console.error);
