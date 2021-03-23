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
        if (Date.now() - message.createdTimestamp > constants_1.COMMAND_EDITABLE_TIME)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9saXN0ZW5lcnMvZGVjcnlwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVNBLCtDQU95QjtBQUV6QixvQ0FBaUM7QUFFakMseUVBQWlEO0FBQ2pELHNEQUEyRDtBQUMzRCwwREFBa0M7QUFFbEMsSUFBaUIsU0FBUyxDQXdFekI7QUF4RUQsV0FBaUIsU0FBUztJQUN4QixTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLEtBQWdCO1FBQ3RELEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFIZSxvQkFBVSxhQUd6QixDQUFBO0lBRUQsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBRTdCLFNBQWdCLFdBQVcsQ0FBQyxNQUFjO1FBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUZlLHFCQUFXLGNBRTFCLENBQUE7SUFFRCxTQUFTLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEtBQWdCO1FBQ2pELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMxQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLHFCQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztT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