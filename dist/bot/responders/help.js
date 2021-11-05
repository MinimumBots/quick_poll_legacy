"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
var Help;
(function (Help) {
    function initialize(bot) {
        allocater_1.Allocater.entryResponder(`<@${bot.user.id}>`, chunk => respond(chunk));
        allocater_1.Allocater.entryResponder(`<@!${bot.user.id}>`, chunk => respond(chunk));
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
