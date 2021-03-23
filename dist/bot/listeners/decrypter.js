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
        return !!(channel.permissionsFor(botID)?.any(constants_1.MINIMUM_BOT_PERMISSIONS));
    }
    function isMatch(message) {
        const content = message.content;
        return (message.type === 'DEFAULT'
            && (content.startsWith(constants_1.COMMAND_PREFIX) || content.startsWith('<@')));
    }
    function accept(message, botID) {
        return (isMatch(message)
            && message.channel.type !== 'dm'
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
            .catch(() => undefined);
    }
    function initialize(bot, botID) {
        bot.on('message', message => decrypt(message, botID));
        bot.on('messageUpdate', (_, message) => redecrypt(message, botID));
    }
    Decrypter.initialize = initialize;
})(Decrypter = exports.Decrypter || (exports.Decrypter = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9saXN0ZW5lcnMvZGVjcnlwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLCtDQU95QjtBQUV6QixvQ0FBaUM7QUFFakMseUVBQWlEO0FBQ2pELHNEQUFtRDtBQUNuRCwwREFBa0M7QUFFbEMsSUFBaUIsU0FBUyxDQW9FekI7QUFwRUQsV0FBaUIsU0FBUztJQUN4QixTQUFTLEtBQUssQ0FBQyxPQUFlO1FBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQztRQUU5QixLQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRTtZQUM5QixJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUFFLFNBQVM7WUFDekMsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFO2dCQUFFLE1BQU07WUFDakMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLG9CQUFVLENBQUMsMkJBQWUsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sYUFBYSxHQUFJLElBQUksb0JBQVUsQ0FBQywwQkFBYyxDQUFDLENBQUM7SUFFdEQsU0FBUyxXQUFXLENBQUMsSUFBVSxFQUFFLEtBQW1CO1FBQ2xELElBQUksSUFBSSxDQUFDLEdBQUc7WUFDVixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7WUFFeEQsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsT0FBdUIsRUFBRSxLQUFnQjtRQUMvRCxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLG1DQUF1QixDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsT0FBZ0I7UUFDL0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUVoQyxPQUFPLENBQ0wsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO2VBQ3ZCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQywwQkFBYyxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNwRSxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsTUFBTSxDQUFDLE9BQWdCLEVBQUUsS0FBZ0I7UUFDaEQsT0FBTyxDQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUM7ZUFDYixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJO2VBQzdCLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztlQUN0QyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQzlDLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsT0FBZ0IsRUFBRSxLQUFnQjtRQUNqRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUQ7O1lBRUMsYUFBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxTQUFTLFNBQVMsQ0FDaEIsT0FBaUMsRUFBRSxLQUFnQjtRQUVuRCxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEdBQUcsaUNBQXFCO1lBQUUsT0FBTztRQUUxRSxPQUFPLENBQUMsS0FBSyxFQUFFO2FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN4QyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBZ0I7UUFDdEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUhlLG9CQUFVLGFBR3pCLENBQUE7QUFDSCxDQUFDLEVBcEVnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQW9FekIifQ==