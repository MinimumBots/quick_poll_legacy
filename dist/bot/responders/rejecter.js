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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVqZWN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3Jlc3BvbmRlcnMvcmVqZWN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXNEO0FBRXRELCtDQUE4RDtBQUU5RCxnREFBOEM7QUFDOUMsZ0RBQTZDO0FBQzdDLG9DQUFpQztBQUVqQyxJQUFpQixRQUFRLENBMER4QjtBQTFERCxXQUFpQixRQUFRO0lBQ2hCLEtBQUssVUFBVSxLQUFLLENBQ3pCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsSUFBSSxTQUFTLFlBQVksNEJBQWU7WUFDdEMsT0FBTyxNQUFNLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7O1lBRTdDLE9BQU8sTUFBTSxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFQcUIsY0FBSyxRQU8xQixDQUFBO0lBRUQsS0FBSyxVQUFVLFdBQVcsQ0FDeEIsU0FBMEIsRUFBRSxPQUFnQjtRQUU1QyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEdBQUcsR0FBRztZQUM1QixPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFMUIsT0FBTyxNQUFNLFVBQVUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssVUFBVSxVQUFVLENBQ3ZCLFNBQWtCLEVBQUUsT0FBZ0I7UUFFcEMsTUFBTSxJQUFJLEdBQUcsTUFBTSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxNQUFNLE1BQU0sR0FBRyxDQUFDLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFaEQsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7YUFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QixPQUFPLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxTQUFTLE9BQU8sQ0FBQyxTQUFrQjtRQUNqQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLFVBQVUsTUFBTSxDQUFDLFNBQWtCLEVBQUUsT0FBZ0I7UUFDeEQsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLENBQUMsZ0JBQU8sQ0FBQyx3QkFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDakQsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQ3hCLENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDN0IseUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDaEUsQ0FBQztRQUNGLE1BQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6RSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsU0FBa0I7UUFDdEMsSUFBSSxLQUFhLENBQUM7UUFFbEIsSUFBSSxTQUFTLFlBQVksS0FBSztZQUM1QixLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDOztZQUU3QyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE9BQU8sYUFBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0FBQ0gsQ0FBQyxFQTFEZ0IsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUEwRHhCIn0=