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
        allocater_1.Allocater.responders.set(`<@${botID}>`, data => respond(data));
        allocater_1.Allocater.responders.set(`<@!${botID}>`, data => respond(data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtDQUEwRDtBQUMxRCxzREFBZ0U7QUFDaEUsZ0RBQW9EO0FBRXBELElBQWlCLElBQUksQ0FrQ3BCO0FBbENELFdBQWlCLElBQUk7SUFDbkIsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFnQjtRQUN0RCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUhlLGVBQVUsYUFHekIsQ0FBQTtJQUVELFNBQVMsY0FBYyxDQUFDLEtBQWdCO1FBQ3RDLHFCQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FDdEIsS0FBSyxLQUFLLEdBQUcsRUFBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FDdEMsQ0FBQztRQUNGLHFCQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FDdEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FDdEMsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFFdEIsU0FBUyxpQkFBaUIsQ0FBQyxHQUFXO1FBQ3BDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxXQUFXLEVBQUUsbUNBQXVCLEVBQUUsQ0FBQzthQUN6RCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO2FBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssVUFBVSxPQUFPLENBQUMsSUFBaUI7UUFDdEMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLElBQUksQ0FBQztRQUVsQyxPQUFPLElBQUksQ0FBQyxRQUFRO1lBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDcEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsU0FBZ0IsUUFBUSxDQUFDLElBQVU7UUFDakMsT0FBTyxnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUZlLGFBQVEsV0FFdkIsQ0FBQTtBQUNILENBQUMsRUFsQ2dCLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQWtDcEIifQ==