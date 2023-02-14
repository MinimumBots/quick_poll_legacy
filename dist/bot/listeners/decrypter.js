"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypter = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
const ratelimits_1 = __importDefault(require("../allotters/ratelimits"));
const allocater_1 = require("../allotters/allocater");
const splitter_1 = __importDefault(require("./splitter"));
var Decrypter;
(function (Decrypter) {
    function initialize(bot) {
        bot
            .on('messageCreate', message => { decrypt(message, bot.user.id); })
            .on('messageUpdate', (_, message) => { redecrypt(message, bot.user.id); });
    }
    Decrypter.initialize = initialize;
    const headers = [];
    function entryHeader(header) {
        headers.push(header);
    }
    Decrypter.entryHeader = entryHeader;
    function decrypt(message, botID) {
        if (accept(message, botID)) {
            const args = split(message.content);
            allocater_1.Allocater.submit(message, args[0], args.slice(1), botID);
        }
        else
            utils_1.Utils.removeMessageCache(message);
    }
    function redecrypt(message, botID) {
        if (Date.now() - message.createdTimestamp > constants_1.COMMAND_EDITABLE_TIME
            || !message.editedTimestamp)
            return;
        message.fetch()
            .then(message => decrypt(message, botID))
            .catch(() => undefined);
    }
    function accept(message, botID) {
        return (isMatch(message)
            && !message.channel.isDMBased()
            && hasPermissions(message.channel, botID)
            && isUnderRate(message.author, message.guild));
    }
    function isMatch(message) {
        return (message.type === discord_js_1.MessageType.Default
            && headers.some(header => message.content.startsWith(header)));
    }
    function hasPermissions(channel, botID) {
        return !!(channel.permissionsFor(botID)?.any(constants_1.MINIMUM_BOT_PERMISSIONS));
    }
    const guildRateLimits = new ratelimits_1.default(constants_1.GUILD_RATE_LIMIT);
    const userRateLimits = new ratelimits_1.default(constants_1.USER_RATE_LIMIT);
    const botRateLimits = new ratelimits_1.default(constants_1.BOT_RATE_LIMIT);
    function isUnderRate(user, guild) {
        return !!(guild
            && (user.bot ? botRateLimits.addition(guild.id) : userRateLimits.addition(user.id))
            && guildRateLimits.addition(guild.id));
    }
    function split(content) {
        const splitter = new splitter_1.default;
        for (const char of [...content]) {
            if (splitter.parseSyntax(char))
                continue;
            if (splitter.overLength())
                break;
            splitter.addCharacter(char);
        }
        return splitter.pushChunk();
    }
})(Decrypter = exports.Decrypter || (exports.Decrypter = {}));
