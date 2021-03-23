"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const constants_1 = require("../../constants");
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
var Help;
(function (Help) {
    function initialize(bot, botID) {
        entryResponder(botID);
        generateInviteURL(bot);
    }
    Help.initialize = initialize;
    function entryResponder(botID) {
        allocater_1.Allocater.entryResponder(`<@${botID}>`, data => respond(data));
        allocater_1.Allocater.entryResponder(`<@!${botID}>`, data => respond(data));
    }
    let botInviteURL = '';
    function generateInviteURL(bot) {
        bot.generateInvite({ permissions: constants_1.DEFAULT_BOT_PERMISSIONS })
            .then(url => botInviteURL = url)
            .catch(console.error);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtDQUEwRDtBQUMxRCxzREFBZ0U7QUFDaEUsZ0RBQW9EO0FBRXBELElBQWlCLElBQUksQ0FrQ3BCO0FBbENELFdBQWlCLElBQUk7SUFDbkIsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFnQjtRQUN0RCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUhlLGVBQVUsYUFHekIsQ0FBQTtJQUVELFNBQVMsY0FBYyxDQUFDLEtBQWdCO1FBQ3RDLHFCQUFTLENBQUMsY0FBYyxDQUN0QixLQUFLLEtBQUssR0FBRyxFQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUN0QyxDQUFDO1FBQ0YscUJBQVMsQ0FBQyxjQUFjLENBQ3RCLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQ3RDLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXRCLFNBQVMsaUJBQWlCLENBQUMsR0FBVztRQUNwQyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsV0FBVyxFQUFFLG1DQUF1QixFQUFFLENBQUM7YUFDekQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQzthQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLElBQWlCO1FBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFbEMsT0FBTyxJQUFJLENBQUMsUUFBUTtZQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELFNBQWdCLFFBQVEsQ0FBQyxJQUFVO1FBQ2pDLE9BQU8sZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFGZSxhQUFRLFdBRXZCLENBQUE7QUFDSCxDQUFDLEVBbENnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUFrQ3BCIn0=