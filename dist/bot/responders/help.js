"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
var Help;
(function (Help) {
    function initialize(bot, botID) {
        allocater_1.Allocater.entryResponder(`<@${botID}>`, chunk => respond(chunk));
        allocater_1.Allocater.entryResponder(`<@!${botID}>`, chunk => respond(chunk));
    }
    Help.initialize = initialize;
    async function respond(chunk) {
        if (chunk.args.length)
            return null;
        return chunk.response
            ? chunk.response.edit({ embeds: [getEmbed(chunk.lang)] })
            : chunk.request.channel.send({ embeds: [getEmbed(chunk.lang)] });
    }
    function getEmbed(lang) {
        return locale_1.Locales[lang].successes.help();
    }
    Help.getEmbed = getEmbed;
})(Help = exports.Help || (exports.Help = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHNEQUFpRTtBQUNqRSxnREFBb0Q7QUFFcEQsSUFBaUIsSUFBSSxDQWlCcEI7QUFqQkQsV0FBaUIsSUFBSTtJQUNuQixTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLEtBQWdCO1FBQ3RELHFCQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssS0FBSyxHQUFHLEVBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNsRSxxQkFBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUhlLGVBQVUsYUFHekIsQ0FBQTtJQUVELEtBQUssVUFBVSxPQUFPLENBQUMsS0FBbUI7UUFDeEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLElBQUksQ0FBQztRQUVuQyxPQUFPLEtBQUssQ0FBQyxRQUFRO1lBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ3pELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxTQUFnQixRQUFRLENBQUMsSUFBVTtRQUNqQyxPQUFPLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFGZSxhQUFRLFdBRXZCLENBQUE7QUFDSCxDQUFDLEVBakJnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUFpQnBCIn0=