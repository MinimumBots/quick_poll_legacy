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
    const userRateLimits = new ratelimits_1.default(constants_1.USER_RATE_LIMIT);
    const botRateLimits = new ratelimits_1.default(constants_1.BOT_RATE_LIMIT);
    function isUnderRate(user, guild) {
        if (user.bot)
            return guild ? botRateLimits.addition(guild.id) : false;
        else
            return userRateLimits.addition(user.id);
    }
    function hasPermissions(channel, botID) {
        return !!(channel.type === 'dm'
            || channel.permissionsFor(botID)?.any(constants_1.MINIMUM_BOT_PERMISSIONS));
    }
    function isMatch(message) {
        const content = message.content;
        return (message.type === 'DEFAULT'
            && (content.startsWith(constants_1.COMMAND_PREFIX) || content.startsWith('<@')));
    }
    function accept(message, botID) {
        return (isMatch(message)
            && hasPermissions(message.channel, botID)
            && isUnderRate(message.author, message.guild));
    }
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
            .catch(console.error);
    }
    function initialize(bot, botID) {
        bot.on('message', message => decrypt(message, botID));
        bot.on('messageUpdate', (_, message) => redecrypt(message, botID));
    }
    Decrypter.initialize = initialize;
})(Decrypter = exports.Decrypter || (exports.Decrypter = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9saXN0ZW5lcnMvZGVjcnlwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLCtDQU95QjtBQUV6QixvQ0FBaUM7QUFFakMseUVBQWlEO0FBQ2pELHNEQUFtRDtBQUNuRCwwREFBa0M7QUFFbEMsSUFBaUIsU0FBUyxDQXNFekI7QUF0RUQsV0FBaUIsU0FBUztJQUN4QixTQUFTLEtBQUssQ0FBQyxPQUFlO1FBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQztRQUU5QixLQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRTtZQUM5QixJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUFFLFNBQVM7WUFDekMsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO2dCQUFFLE1BQU07WUFDakMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLG9CQUFVLENBQUMsMkJBQWUsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sYUFBYSxHQUFJLElBQUksb0JBQVUsQ0FBQywwQkFBYyxDQUFDLENBQUM7SUFFdEQsU0FBUyxXQUFXLENBQUMsSUFBVSxFQUFFLEtBQW1CO1FBQ2xELElBQUksSUFBSSxDQUFDLEdBQUc7WUFDVixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7WUFFeEQsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsT0FBdUIsRUFBRSxLQUFnQjtRQUMvRCxPQUFPLENBQUMsQ0FBQyxDQUNQLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSTtlQUNsQixPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxtQ0FBdUIsQ0FBQyxDQUMvRCxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsT0FBTyxDQUFDLE9BQWdCO1FBQy9CLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFaEMsT0FBTyxDQUNMLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUztlQUN2QixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsMEJBQWMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDcEUsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxPQUFnQixFQUFFLEtBQWdCO1FBQ2hELE9BQU8sQ0FDTCxPQUFPLENBQUMsT0FBTyxDQUFDO2VBQ2IsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO2VBQ3RDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FDOUMsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEtBQWdCO1FBQ2pELElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMxQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BDLHFCQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxRDs7WUFFQyxhQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFNBQVMsU0FBUyxDQUNoQixPQUFpQyxFQUFFLEtBQWdCO1FBRW5ELElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxpQ0FBcUI7WUFBRSxPQUFPO1FBRTFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7YUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBZ0I7UUFDdEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUhlLG9CQUFVLGFBR3pCLENBQUE7QUFDSCxDQUFDLEVBdEVnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXNFekIifQ==