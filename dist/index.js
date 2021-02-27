"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const totalShards = process.env['TOTAL_SHARDS'] ? Number(process.env['TOTAL_SHARDS']) : 'auto';
const manager = new discord_js_1.ShardingManager('./dist/bot/bot.js', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBNkM7QUFFN0MsTUFBTSxXQUFXLEdBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQy9FLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQWUsQ0FBQyxtQkFBbUIsRUFBRTtJQUN2RCxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztJQUN0QyxXQUFXLEVBQUUsV0FBVztDQUN6QixDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRTtJQUNoQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUN6RSxDQUFDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN4QyxPQUFPLENBQUMsS0FBSyxFQUFFO0tBQ1osSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUNsRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=