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
function initialize(botID) {
    health_1.Health.initialize(bot);
    decrypter_1.Decrypter.initialize(bot, botID);
    allocater_1.Allocater.initialize(bot, botID);
    session_1.Session.initialize(bot);
    judge_1.Judge.initialize(bot, botID);
}
let presenceCount = 0;
setInterval(() => {
    utils_1.Utils.updatePresence(bot, presenceCount++)
        .catch(console.error);
}, constants_1.PRESENCE_UPDATE_INTERVAL);
bot.on('ready', bot => {
    initialize(bot.application.id);
});
bot.on('shardReady', shardID => console.info(`Shard No.${shardID} is ready.`));
bot.login(process.env['QUICK_POLL_TOKEN'])
    .catch(console.error);
process.on('exit', () => bot.destroy());
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JvdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMkU7QUFFM0UsNENBS3NCO0FBQ3RCLG1DQUFnQztBQUVoQyxtREFBZ0Q7QUFFaEQscURBQWtEO0FBQ2xELHFEQUFrRDtBQUNsRCw2Q0FBMEM7QUFDMUMsaURBQThDO0FBRTlDLE1BQU0sU0FBUyxHQUFHLG9CQUFPLENBQUMsZUFBZSxDQUFDO0lBQ3hDLEdBQUcsb0JBQU8sQ0FBQyx3QkFBd0I7SUFDbkMsY0FBYyxFQUFFO1FBQ2QsYUFBYSxFQUFFLGtDQUFzQjtRQUNyQyxXQUFXLEVBQUUsOEJBQWlCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLEVBQUUsa0NBQXNCLEVBQUUsQ0FBQztLQUN0RjtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksbUJBQU0sQ0FBQztJQUNyQixTQUFTLEVBQUUsU0FBUztJQUNwQixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDO0lBQ3BFLGNBQWMsRUFBRSxHQUFHO0lBQ25CLFVBQVUsRUFBRSxDQUFDO0lBQ2IsT0FBTyxFQUFFLHVCQUFXO0lBQ3BCLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO0NBQzVFLENBQUMsQ0FBQztBQUVILFNBQVMsVUFBVSxDQUFDLEtBQWdCO0lBQ2xDLGVBQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLHFCQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixhQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDZixhQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztTQUN2QyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUMsRUFBRSxvQ0FBd0IsQ0FBQyxDQUFDO0FBRTdCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0lBQ3BCLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0gsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBRS9FLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQ3ZDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFeEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDeEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFHLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyJ9