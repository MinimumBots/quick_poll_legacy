"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rejecter = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const locale_1 = require("../templates/locale");
const preferences_1 = require("../preferences");
const utils_1 = require("../utils");
var Rejecter;
(function (Rejecter) {
    async function issue(exception, request) {
        if (exception instanceof discord_js_1.DiscordAPIError)
            return await forAPIError(exception, request);
        else
            return await forUnknown(exception, request);
    }
    Rejecter.issue = issue;
    async function forAPIError(exception, request) {
        if (exception.httpStatus / 500)
            return destroy(exception);
        else
            return await forUnknown(exception, request);
    }
    async function forUnknown(exception, request) {
        const lang = await preferences_1.Preferences.fetchLang(request.author, request.guild);
        const embeds = [locale_1.Locales[lang].errors.unknown()];
        report(exception, request)
            .catch(console.error);
        return await request.channel.send({ embeds });
    }
    function destroy(exception) {
        console.error(exception);
    }
    async function report(exception, request) {
        const stacks = renderStacks(exception);
        const embeds = [locale_1.Locales[constants_1.DEFAULT_LANG].reports.error(request.content, stacks)];
        const users = await Promise.all(constants_1.BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID)));
        const dmChannels = await Promise.all(users.map(user => user.createDM()));
        await Promise.all(dmChannels.map(channel => channel.send({ embeds })));
    }
    function renderStacks(exception) {
        let stack;
        if (exception instanceof Error)
            stack = exception.stack ?? exception.message;
        else
            stack = JSON.stringify(exception, null, 2);
        return utils_1.Utils.partingText(stack, 1024, '', '');
    }
})(Rejecter = exports.Rejecter || (exports.Rejecter = {}));
