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
        const embed = locale_1.Locales[lang].errors.unknown();
        report(exception, request)
            .catch(console.error);
        return await request.channel.send({ embed });
    }
    function destroy(exception) {
        console.error(exception);
    }
    async function report(exception, request) {
        const stacks = renderStacks(exception);
        const embed = locale_1.Locales[constants_1.DEFAULT_LANG].reports.error(request.content, stacks);
        const users = await Promise.all(constants_1.BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID)));
        const dmChannels = await Promise.all(users.map(user => user.createDM()));
        await Promise.all(dmChannels.map(channel => channel.send({ embed })));
    }
    function renderStacks(exception) {
        let stack;
        if (exception instanceof Error)
            stack = exception.stack ?? exception.message;
        else
            stack = String(exception);
        return utils_1.Utils.partingText(stack, 1024, '', '');
    }
})(Rejecter = exports.Rejecter || (exports.Rejecter = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVqZWN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3Jlc3BvbmRlcnMvcmVqZWN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXNEO0FBRXRELCtDQUE4RDtBQUU5RCxnREFBOEM7QUFDOUMsZ0RBQTZDO0FBQzdDLG9DQUFpQztBQUVqQyxJQUFpQixRQUFRLENBMER4QjtBQTFERCxXQUFpQixRQUFRO0lBQ2hCLEtBQUssVUFBVSxLQUFLLENBQ3pCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsSUFBSSxTQUFTLFlBQVksNEJBQWU7WUFDdEMsT0FBTyxNQUFNLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7O1lBRTdDLE9BQU8sTUFBTSxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFQcUIsY0FBSyxRQU8xQixDQUFBO0lBRUQsS0FBSyxVQUFVLFdBQVcsQ0FDeEIsU0FBMEIsRUFBRSxPQUFnQjtRQUU1QyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRztZQUM1QixPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFMUIsT0FBTyxNQUFNLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssVUFBVSxVQUFVLENBQ3ZCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsTUFBTSxJQUFJLEdBQUcsTUFBTSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxNQUFNLEtBQUssR0FBRyxnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUU3QyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzthQUN2QixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE9BQU8sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELFNBQVMsT0FBTyxDQUFDLFNBQWtCO1FBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssVUFBVSxNQUFNLENBQUMsU0FBa0IsRUFBRSxPQUFnQjtRQUN4RCxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsTUFBTSxLQUFLLEdBQUcsZ0JBQU8sQ0FBQyx3QkFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDL0MsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQ3hCLENBQUM7UUFDRixNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQzdCLHlCQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2hFLENBQUM7UUFDRixNQUFNLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELFNBQVMsWUFBWSxDQUFDLFNBQWtCO1FBQ3RDLElBQUksS0FBYSxDQUFDO1FBRWxCLElBQUksU0FBUyxZQUFZLEtBQUs7WUFDNUIsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQzs7WUFFN0MsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QixPQUFPLGFBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztBQUNILENBQUMsRUExRGdCLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBMER4QiJ9