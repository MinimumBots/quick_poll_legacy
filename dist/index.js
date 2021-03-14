"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const constants_1 = require("./constants");
const totalShards = constants_1.BOT_TOTAL_SHARDS;
const manager = new discord_js_1.ShardingManager('./dist/bot/bot.js', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBNkM7QUFDN0MsMkNBQStDO0FBRS9DLE1BQU0sV0FBVyxHQUFHLDRCQUFnQixDQUFDO0FBRXJDLE1BQU0sT0FBTyxHQUFHLElBQUksNEJBQWUsQ0FBQyxtQkFBbUIsRUFBRTtJQUN2RCxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztJQUN0QyxXQUFXLEVBQUUsV0FBVztDQUN6QixDQUFDLENBQUM7QUFFSCxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRTtJQUNoQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUN4RSxDQUFDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN2QyxPQUFPLENBQUMsS0FBSyxFQUFFO0tBQ1osSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztLQUNqRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=