"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypter = void 0;
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
const ratelimits_1 = __importDefault(require("../allotters/ratelimits"));
const allocater_1 = require("../allotters/allocater");
const splitter_1 = __importDefault(require("./splitter"));
var Decrypter;
(function (Decrypter) {
    function initialize(bot, botID) {
        bot.on('message', message => decrypt(message, botID));
        bot.on('messageUpdate', (_, message) => redecrypt(message, botID));
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
            && message.channel.type !== 'dm'
            && hasPermissions(message.channel, botID)
            && isUnderRate(message.author, message.guild));
    }
    function isMatch(message) {
        return (message.type === 'DEFAULT'
            && headers.some(header => message.content.startsWith(header)));
    }
    function hasPermissions(channel, botID) {
        return !!(channel.permissionsFor(botID)?.any(constants_1.MINIMUM_BOT_PERMISSIONS));
    }
    const userRateLimits = new ratelimits_1.default(constants_1.USER_RATE_LIMIT);
    const botRateLimits = new ratelimits_1.default(constants_1.BOT_RATE_LIMIT);
    function isUnderRate(user, guild) {
        if (user.bot)
            return guild ? botRateLimits.addition(guild.id) : false;
        else
            return userRateLimits.addition(user.id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9saXN0ZW5lcnMvZGVjcnlwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLCtDQU95QjtBQUV6QixvQ0FBaUM7QUFFakMseUVBQWlEO0FBQ2pELHNEQUEyRDtBQUMzRCwwREFBa0M7QUFFbEMsSUFBaUIsU0FBUyxDQTJFekI7QUEzRUQsV0FBaUIsU0FBUztJQUN4QixTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLEtBQWdCO1FBQ3RELEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFIZSxvQkFBVSxhQUd6QixDQUFBO0lBRUQsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBRTdCLFNBQWdCLFdBQVcsQ0FBQyxNQUFjO1FBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUZlLHFCQUFXLGNBRTFCLENBQUE7SUFFRCxTQUFTLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEtBQWdCO1FBQ2pELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMxQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLHFCQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztT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