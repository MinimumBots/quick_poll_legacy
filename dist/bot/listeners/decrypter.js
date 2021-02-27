"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypter = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const ratelimits_1 = __importDefault(require("../allotters/ratelimits"));
const allocater_1 = require("../allotters/allocater");
const parsing_1 = __importDefault(require("./parsing"));
exports.Decrypter = {
    initialize(bot) {
        bot.on('message', message => exports.Decrypter.decrypt(message));
        bot.on('messageUpdate', (_, message) => exports.Decrypter.redecrypt(message));
    },
    userRateLimits: new ratelimits_1.default(constants_1.USER_RATE_LIMIT),
    botRateLimits: new ratelimits_1.default(constants_1.BOT_RATE_LIMIT),
    decrypt(message) {
        if (this.accept(message)) {
            const args = this.parse(message.content);
            allocater_1.Allocater.submit(message, args[0], args.slice(1));
        }
        else
            utils_1.removeMessageCache(message);
    },
    redecrypt(message) {
        if (Date.now() - message.createdTimestamp > constants_1.COMMAND_EDITABLE_TIME)
            return;
        message.fetch()
            .then(message => this.decrypt(message))
            .catch(console.error);
    },
    accept(message) {
        return (this.isMatch(message)
            && this.hasPermissions(message.channel)
            && this.isUnderRate(message.author, message.guild));
    },
    isMatch(message) {
        const content = message.content;
        return (message.type === 'DEFAULT'
            && (content.startsWith(constants_1.COMMAND_PREFIX) || content.startsWith('<@')));
    },
    hasPermissions(channel) {
        const bot = channel.client;
        return !!(channel.type === 'dm'
            || bot.user
                && channel.permissionsFor(bot.user)?.any(constants_1.MINIMUM_BOT_PERMISSIONS));
    },
    isUnderRate(user, guild) {
        if (user.bot)
            return guild ? this.botRateLimits.addition(guild.id) : false;
        else
            return this.userRateLimits.addition(user.id);
    },
    parse(content) {
        const parsing = new parsing_1.default;
        for (const char of [...content]) {
            if (parsing.parseSyntax(char))
                continue;
            if (parsing.overLength())
                break;
            parsing.addCharacter(char);
        }
        return parsing.pushChunk();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjcnlwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9saXN0ZW5lcnMvZGVjcnlwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDRDQU9zQjtBQUV0QixvQ0FBOEM7QUFFOUMseUVBQWlEO0FBQ2pELHNEQUFtRDtBQUNuRCx3REFBZ0M7QUFFbkIsUUFBQSxTQUFTLEdBZWxCO0lBQ0YsVUFBVSxDQUFDLEdBQUc7UUFDWixHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDekQsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxpQkFBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxjQUFjLEVBQUUsSUFBSSxvQkFBVSxDQUFDLDJCQUFlLENBQUM7SUFDL0MsYUFBYSxFQUFHLElBQUksb0JBQVUsQ0FBQywwQkFBYyxDQUFDO0lBRTlDLE9BQU8sQ0FBQyxPQUFPO1FBQ2IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLHFCQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25EOztZQUVDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxTQUFTLENBQUMsT0FBTztRQUNmLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxpQ0FBcUI7WUFBRSxPQUFPO1FBRTFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7YUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3RDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTyxDQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2VBQ2xCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztlQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUNuRCxDQUFDO0lBQ0osQ0FBQztJQUNELE9BQU8sQ0FBQyxPQUFPO1FBQ2IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUVoQyxPQUFPLENBQ0wsT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO2VBQ3ZCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQywwQkFBYyxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUNwRSxDQUFDO0lBQ0osQ0FBQztJQUNELGNBQWMsQ0FBQyxPQUFPO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFFMUIsT0FBTyxDQUFDLENBQUMsQ0FDUCxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUk7ZUFDbEIsR0FBRyxDQUFDLElBQUk7bUJBQ1IsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLG1DQUF1QixDQUFDLENBQ2xFLENBQUM7SUFDSixDQUFDO0lBQ0QsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLO1FBQ3JCLElBQUksSUFBSSxDQUFDLEdBQUc7WUFDVixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7O1lBRTdELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQztRQUU1QixLQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRTtZQUM5QixJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUFFLFNBQVM7WUFDeEMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUFFLE1BQU07WUFDaEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtRQUVELE9BQU8sT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRixDQUFDIn0=