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
        allocater_1.Allocater.entryResponder(`<@${botID}>`, data => respond(data));
        allocater_1.Allocater.entryResponder(`<@!${botID}>`, data => respond(data));
        bot.generateInvite({ permissions: constants_1.DEFAULT_BOT_PERMISSIONS })
            .then(url => botInviteURL = url)
            .catch(console.error);
    }
    Help.initialize = initialize;
    async function respond(data) {
        if (data.args.length)
            return null;
        return data.response
            ? data.response.edit({ embed: getEmbed(data.lang) })
            : data.request.channel.send({ embed: getEmbed(data.lang) });
    }
    function getEmbed(lang) {
        return locale_1.Locales[lang].successes.help(botInviteURL);
    }
    Help.getEmbed = getEmbed;
})(Help = exports.Help || (exports.Help = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtDQUEwRDtBQUMxRCxzREFBZ0U7QUFDaEUsZ0RBQW9EO0FBRXBELElBQWlCLElBQUksQ0F1QnBCO0FBdkJELFdBQWlCLElBQUk7SUFDbkIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXRCLFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBZ0I7UUFDdEQscUJBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxLQUFLLEdBQUcsRUFBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLHFCQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVoRSxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsV0FBVyxFQUFFLG1DQUF1QixFQUFFLENBQUM7YUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQzthQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFQZSxlQUFVLGFBT3pCLENBQUE7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQWlCO1FBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEMsT0FBTyxJQUFJLENBQUMsUUFBUTtZQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUFVO1FBQ2pDLE9BQU8sZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFGZSxhQUFRLFdBRXZCLENBQUE7QUFDSCxDQUFDLEVBdkJnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUF1QnBCIn0=