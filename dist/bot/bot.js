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
