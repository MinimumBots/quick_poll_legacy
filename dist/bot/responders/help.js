"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const constants_1 = require("../../constants");
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
var Help;
(function (Help) {
    let botInviteURL = '';
    function initialize(bot, botID) {
        allocater_1.Allocater.entryResponder(`<@${botID}>`, chunk => respond(chunk));
        allocater_1.Allocater.entryResponder(`<@!${botID}>`, chunk => respond(chunk));
        bot.generateInvite({ permissions: constants_1.DEFAULT_BOT_PERMISSIONS })
            .then(url => botInviteURL = url)
            .catch(console.error);
    }
    Help.initialize = initialize;
    async function respond(chunk) {
        if (chunk.args.length)
            return null;
        return chunk.response
            ? chunk.response.edit({ embed: getEmbed(chunk.lang) })
            : chunk.request.channel.send({ embed: getEmbed(chunk.lang) });
    }
    function getEmbed(lang) {
        return locale_1.Locales[lang].successes.help(botInviteURL);
    }
    Help.getEmbed = getEmbed;
})(Help = exports.Help || (exports.Help = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtDQUEwRDtBQUMxRCxzREFBaUU7QUFDakUsZ0RBQW9EO0FBRXBELElBQWlCLElBQUksQ0F1QnBCO0FBdkJELFdBQWlCLElBQUk7SUFDbkIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXRCLFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBZ0I7UUFDdEQscUJBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxLQUFLLEdBQUcsRUFBRyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLHFCQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUVsRSxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsV0FBVyxFQUFFLG1DQUF1QixFQUFFLENBQUM7YUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQzthQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFQZSxlQUFVLGFBT3pCLENBQUE7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQW1CO1FBQ3hDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbkMsT0FBTyxLQUFLLENBQUMsUUFBUTtZQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3RELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUFVO1FBQ2pDLE9BQU8sZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFGZSxhQUFRLFdBRXZCLENBQUE7QUFDSCxDQUFDLEVBdkJnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUF1QnBCIn0=