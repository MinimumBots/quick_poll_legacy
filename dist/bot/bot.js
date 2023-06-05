"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const constants_1 = require("../constants");
// import { Utils } from './utils';
// import { Health } from '../transactions/health';
const decrypter_1 = require("./listeners/decrypter");
const allocater_1 = require("./allotters/allocater");
const judge_1 = require("./listeners/judge");
const session_1 = require("./allotters/session");
const makeCache = discord_js_1.Options.cacheWithLimits({
    ...discord_js_1.Options.DefaultMakeCacheSettings,
    MessageManager: {
        maxSize: 200,
        keepOverLimit: judge_1.Judge.adjustCache,
    },
});
const bot = new discord_js_1.Client({
    makeCache: makeCache,
    partials: [
        discord_js_1.Partials.User,
        discord_js_1.Partials.Channel,
        discord_js_1.Partials.GuildMember,
        discord_js_1.Partials.Message,
        discord_js_1.Partials.Reaction,
        discord_js_1.Partials.ThreadMember,
        discord_js_1.Partials.GuildScheduledEvent,
    ],
    rest: {
        offset: 100,
    },
    intents: constants_1.BOT_INTENTS,
    presence: {
        status: 'online',
        activities: [
            {
                type: discord_js_1.ActivityType.Playing,
                name: `${constants_1.COMMAND_PREFIX}poll | ${constants_1.COMMAND_PREFIX}expoll`,
            }
        ],
    },
});
function initialize(bot) {
    // Health.initialize(bot);
    decrypter_1.Decrypter.initialize(bot);
    allocater_1.Allocater.initialize(bot);
    session_1.Session.initialize(bot);
    judge_1.Judge.initialize(bot);
}
// let presenceCount = 0;
// setInterval(() => {
//   Utils.updatePresence(bot, presenceCount++)
//     .catch(console.error);
// }, PRESENCE_UPDATE_INTERVAL);
bot
    .on('ready', bot => initialize(bot))
    .on('shardReady', shardId => console.info(`Shard No.${shardId} is ready.`));
bot.login(process.env['DISCORD_TOKEN'])
    .catch(console.error);
['SIGTERM', 'SIGINT']
    .forEach(signal => process.on(signal, () => {
    bot.destroy();
    process.exit(0);
}));
