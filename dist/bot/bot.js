"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const health_1 = require("../transactions/health");
const decrypter_1 = require("./listeners/decrypter");
const allocater_1 = require("./allotters/allocater");
const judge_1 = require("./listeners/judge");
const session_1 = require("./allotters/session");
const makeCache = discord_js_1.Options.cacheWithLimits({
    ...discord_js_1.Options.defaultMakeCacheSettings,
    MessageManager: {
        sweepInterval: constants_1.MESSAGE_SWEEP_INTERVAL,
        sweepFilter: discord_js_1.LimitedCollection.filterByLifetime({ lifetime: constants_1.MESSAGE_CACHE_LIFETIME }),
    },
});
const bot = new discord_js_1.Client({
    makeCache: makeCache,
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
    restTimeOffset: 100,
    retryLimit: 3,
    intents: constants_1.BOT_INTENTS,
    presence: { status: 'dnd', activities: [{ type: 'PLAYING', name: '再接続' }] },
});
function initialize(bot) {
    const botId = bot.application.id;
    health_1.Health.initialize(bot);
    decrypter_1.Decrypter.initialize(bot);
    allocater_1.Allocater.initialize(bot);
    session_1.Session.initialize(bot);
    judge_1.Judge.initialize(bot);
}
let presenceCount = 0;
setInterval(() => {
    utils_1.Utils.updatePresence(bot, presenceCount++)
        .catch(console.error);
}, constants_1.PRESENCE_UPDATE_INTERVAL);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JvdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBZ0U7QUFFaEUsNENBS3NCO0FBQ3RCLG1DQUFnQztBQUVoQyxtREFBZ0Q7QUFFaEQscURBQWtEO0FBQ2xELHFEQUFrRDtBQUNsRCw2Q0FBMEM7QUFDMUMsaURBQThDO0FBRTlDLE1BQU0sU0FBUyxHQUFHLG9CQUFPLENBQUMsZUFBZSxDQUFDO0lBQ3hDLEdBQUcsb0JBQU8sQ0FBQyx3QkFBd0I7SUFDbkMsY0FBYyxFQUFFO1FBQ2QsYUFBYSxFQUFFLGtDQUFzQjtRQUNyQyxXQUFXLEVBQUUsOEJBQWlCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLEVBQUUsa0NBQXNCLEVBQUUsQ0FBQztLQUN0RjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksbUJBQU0sQ0FBQztJQUNyQixTQUFTLEVBQUUsU0FBUztJQUNwQixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBQ3BFLGNBQWMsRUFBRSxHQUFHO0lBQ25CLFVBQVUsRUFBRSxDQUFDO0lBQ2IsT0FBTyxFQUFFLHVCQUFXO0lBQ3BCLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO0NBQzVFLENBQUMsQ0FBQztBQUVILFNBQVMsVUFBVSxDQUFDLEdBQWlCO0lBQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO0lBRWpDLGVBQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsaUJBQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEIsYUFBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRUQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixhQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztTQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUMsRUFBRSxvQ0FBd0IsQ0FBQyxDQUFDO0FBRTdCLEdBQUc7S0FDQSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25DLEVBQUUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBRTlFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQ3ZDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFeEIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0tBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUN6QyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDLENBQUMifQ==