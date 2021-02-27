"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rejecter = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../constants");
const template_1 = require("../templates/template");
const preferences_1 = require("../preferences");
const utils_1 = require("../utils");
exports.Rejecter = {
    async issue(exception, request) {
        if (exception instanceof discord_js_1.HTTPError)
            return await this.forHTTPError(exception, request);
        else
            return await this.forUnknown(exception, request);
    },
    async forHTTPError(exception, request) {
        if (exception.code / 500)
            return this.destroy(exception);
        else
            return await this.forUnknown(exception, request);
    },
    async forUnknown(exception, request) {
        const locale = await preferences_1.Preferences.fetchLocale(request.author, request.guild);
        const template = template_1.Templates[locale].errors['unknown'];
        this.report(exception, request)
            .catch(console.error);
        return await request.channel.send(template.render());
    },
    destroy(exception) {
        console.error(exception);
    },
    async report(exception, request) {
        const users = await Promise.all(constants_1.BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID)));
        const template = template_1.Templates[constants_1.DEFAULT_LOCALE].reports['error'];
        const stacks = this.renderStacks(exception);
        const embed = template.render({ executedCommand: request.content });
        stacks.forEach((text, index) => template.appendField(embed, {
            stackTraceNumber: `${index + 1}`, stackTraceText: text
        }));
        await Promise.all(users.map(user => user.dmChannel?.send(embed)));
    },
    renderStacks(exception) {
        let stack;
        if (exception instanceof Error)
            stack = exception.stack ?? exception.message;
        else
            stack = String(exception);
        return utils_1.partingText(stack, 1024, '```', '```');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVqZWN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3Jlc3BvbmRlcnMvcmVqZWN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTZEO0FBRTdELDRDQUE2RDtBQUU3RCxvREFBMEQ7QUFDMUQsZ0RBQTZDO0FBQzdDLG9DQUF1QztBQUUxQixRQUFBLFFBQVEsR0FTakI7SUFDRixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPO1FBQzVCLElBQUksU0FBUyxZQUFZLHNCQUFTO1lBQ2hDLE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzs7WUFFbkQsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPO1FBQ25DLElBQUksU0FBUyxDQUFDLElBQUksR0FBRyxHQUFHO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFL0IsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDRCxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxPQUFPO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLE1BQU0seUJBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUUsTUFBTSxRQUFRLEdBQUcsb0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO2FBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEIsT0FBTyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFDRCxPQUFPLENBQUMsU0FBUztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU87UUFDN0IsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUM3Qix5QkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNoRSxDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsb0JBQVMsQ0FBQywwQkFBYyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDMUQsZ0JBQWdCLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUk7U0FDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQ0QsWUFBWSxDQUFDLFNBQVM7UUFDcEIsSUFBSSxLQUFhLENBQUM7UUFFbEIsSUFBSSxTQUFTLFlBQVksS0FBSztZQUM1QixLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDOztZQUU3QyxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTVCLE9BQU8sbUJBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBQ0YsQ0FBQSJ9