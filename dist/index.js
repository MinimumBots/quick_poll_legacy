"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const totalShards = process.env['TOTAL_SHARDS'] ? Number(process.env['TOTAL_SHARDS']) : 'auto';
const manager = new discord_js_1.ShardingManager('./dist/bot.js', {
    token: process.env['QUICK_POLL_TOKEN'],
    totalShards: totalShards
});
manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id + 1}/${manager.totalShards}.`);
});
manager.spawn()
    .catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBNkM7QUFFN0MsTUFBTSxXQUFXLEdBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQy9FLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQWUsQ0FBQyxlQUFlLEVBQUU7SUFDbkQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7SUFDdEMsV0FBVyxFQUFFLFdBQVc7Q0FDekIsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQUU7SUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDeEUsQ0FBQyxDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsS0FBSyxFQUFFO0tBQ1osS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyJ9