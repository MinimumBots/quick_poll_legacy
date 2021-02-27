"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const constants_1 = require("../constants");
const allocater_1 = require("../allotters/allocater");
const template_1 = require("../templates/template");
const preferences_1 = require("../preferences");
exports.Help = {
    initialize(bot) {
        if (!bot.user) {
            bot.setTimeout(() => this.initialize(bot), 30000);
            return;
        }
        allocater_1.Allocater.responders.set(`<@${bot.user.id}>`, exports.Help.respond);
        allocater_1.Allocater.responders.set(`<@!${bot.user.id}>`, exports.Help.respond);
    },
    generateInviteURL(bot) {
        bot.generateInvite({ permissions: constants_1.DEFAULT_BOT_PERMISSIONS })
            .then(url => this.botInviteURL = url)
            .catch(() => bot.setTimeout(() => this.generateInviteURL(bot), 30000));
    },
    botInviteURL: '',
    async respond(request, args, response) {
        if (args !== [])
            return undefined;
        const embed = await this.getEmbed(request.author, request.guild);
        if (!response)
            return this.create(request.channel, embed);
        else
            return this.edit(response, embed);
    },
    create(channel, embed) {
        return channel.send(embed);
    },
    edit(response, embed) {
        return response.edit(embed);
    },
    async getEmbed(user, guild) {
        const locale = await preferences_1.Preferences.fetchLocale(user, guild);
        return template_1.Templates[locale].successes['help'].render({
            botInviteURL: this.botInviteURL
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDRDQUE2RTtBQUM3RSxzREFBOEQ7QUFDOUQsb0RBQWtEO0FBQ2xELGdEQUE2QztBQUVoQyxRQUFBLElBQUksR0FZYjtJQUNGLFVBQVUsQ0FBQyxHQUFHO1FBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDYixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsT0FBTztTQUNSO1FBRUQscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRyxZQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0QscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxZQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNELGlCQUFpQixDQUFDLEdBQUc7UUFDbkIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxtQ0FBdUIsRUFBRSxDQUFDO2FBQ3pELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO2FBQ3BDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDRCxZQUFZLEVBQUUsRUFBRTtJQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUTtRQUNuQyxJQUFJLElBQUksS0FBSyxFQUFFO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFFbEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxRQUFRO1lBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7O1lBRTNDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSztRQUNuQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSztRQUNsQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUs7UUFDeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSx5QkFBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsT0FBTyxvQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDaEQsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFBIn0=