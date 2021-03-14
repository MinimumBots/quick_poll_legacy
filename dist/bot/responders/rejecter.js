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
        if (exception.code / 500)
            return destroy(exception);
        else
            return await forUnknown(exception, request);
    }
    async function forUnknown(exception, request) {
        const lang = await preferences_1.Preferences.fetchLang(request.author, request.guild);
        const template = locale_1.Locales[lang].errors.unknown();
        report(exception, request)
            .catch(console.error);
        return await request.channel.send(template);
    }
    function destroy(exception) {
        console.error(exception);
    }
    async function report(exception, request) {
        const stacks = renderStacks(exception);
        const template = locale_1.Locales[constants_1.DEFAULT_LANG].reports.error(request.content, stacks);
        const users = await Promise.all(constants_1.BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID)));
        await Promise.all(users.map(user => user.dmChannel?.send(template)));
    }
    function renderStacks(exception) {
        let stack;
        if (exception instanceof Error)
            stack = exception.stack ?? exception.message;
        else
            stack = String(exception);
        return utils_1.Utils.partingText(stack, 1024, '```', '```');
    }
})(Rejecter = exports.Rejecter || (exports.Rejecter = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVqZWN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3Jlc3BvbmRlcnMvcmVqZWN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXNEO0FBRXRELCtDQUE4RDtBQUU5RCxnREFBOEM7QUFDOUMsZ0RBQTZDO0FBQzdDLG9DQUFpQztBQUVqQyxJQUFpQixRQUFRLENBeUR4QjtBQXpERCxXQUFpQixRQUFRO0lBQ2hCLEtBQUssVUFBVSxLQUFLLENBQ3pCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsSUFBSSxTQUFTLFlBQVksNEJBQWU7WUFDdEMsT0FBTyxNQUFNLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7O1lBRTdDLE9BQU8sTUFBTSxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFQcUIsY0FBSyxRQU8xQixDQUFBO0lBRUQsS0FBSyxVQUFVLFdBQVcsQ0FDeEIsU0FBMEIsRUFBRSxPQUFnQjtRQUU1QyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEdBQUcsR0FBRztZQUN0QixPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFMUIsT0FBTyxNQUFNLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssVUFBVSxVQUFVLENBQ3ZCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsTUFBTSxJQUFJLEdBQUcsTUFBTSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxNQUFNLFFBQVEsR0FBRyxnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoRCxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzthQUN2QixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsU0FBUyxPQUFPLENBQUMsU0FBa0I7UUFDakMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxVQUFVLE1BQU0sQ0FBQyxTQUFrQixFQUFFLE9BQWdCO1FBQ3hELE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxNQUFNLFFBQVEsR0FBRyxnQkFBTyxDQUFDLHdCQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNsRCxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FDeEIsQ0FBQztRQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDN0IseUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDaEUsQ0FBQztRQUVGLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxTQUFTLFlBQVksQ0FBQyxTQUFrQjtRQUN0QyxJQUFJLEtBQWEsQ0FBQztRQUVsQixJQUFJLFNBQVMsWUFBWSxLQUFLO1lBQzVCLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUM7O1lBRTdDLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUIsT0FBTyxhQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RELENBQUM7QUFDSCxDQUFDLEVBekRnQixRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQXlEeEIifQ==