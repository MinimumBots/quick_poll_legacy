"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const constants_1 = require("./constants");
const manager = new discord_js_1.ShardingManager('./dist/bot/bot.js', {
    token: process.env['DISCORD_TOKEN'],
    totalShards: constants_1.BOT_TOTAL_SHARDS,
    shardList: constants_1.BOT_SHARD_LIST,
});
manager.on('shardCreate', shard => {
    console.info(`Spawned shard ${shard.id + 1}/${manager.totalShards}.`);
});
console.info('Start spawning shards.');
manager.spawn({ timeout: -1 })
    .then(() => console.info('All shards were successfully spawned.'))
    .catch(console.error);
