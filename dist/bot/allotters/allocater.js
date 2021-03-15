"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allocater = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const session_1 = require("./session");
const help_1 = require("../responders/help");
const rejecter_1 = require("../responders/rejecter");
const utils_1 = require("../utils");
const preferences_1 = require("../preferences");
const poll_1 = require("../responders/poll");
const result_1 = require("../responders/result");
var Allocater;
(function (Allocater) {
    function initialize(bot, botID) {
        help_1.Help.initialize(bot, botID);
        poll_1.Poll.initialize();
        result_1.Result.initialize();
    }
    Allocater.initialize = initialize;
    Allocater.responders = new discord_js_1.Collection;
    function submit(request, prefix, args, botID) {
        const responder = Allocater.responders.get(prefix);
        if (responder)
            respond(request, responder, prefix, args, botID)
                .catch(console.error);
    }
    Allocater.submit = submit;
    async function respond(request, responder, prefix, args, botID) {
        const session = session_1.Session.get(request.id);
        const response = session?.response ?? null;
        const lang = await preferences_1.Preferences.fetchLang(request.author, request.guild);
        try {
            const newResponse = await responder({
                botID, request, prefix, args, response, lang
            });
            if (!newResponse)
                return;
            allocate(request, newResponse, session);
        }
        catch (exception) {
            reject(exception, request);
        }
    }
    function reject(exception, request) {
        if (constants_1.DEBUG_MODE)
            console.error(exception);
        rejecter_1.Rejecter.issue(exception, request)
            .then(response => response && allocate(request, response))
            .catch(console.error);
    }
    function allocate(request, response, session) {
        if (!response)
            utils_1.Utils.removeMessageCache(request);
        else if (!session)
            session_1.Session.create(request, response);
    }
})(Allocater = exports.Allocater || (exports.Allocater = {}));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFvRTtBQUVwRSwrQ0FBNkM7QUFDN0MsdUNBQW9DO0FBQ3BDLDZDQUEwQztBQUMxQyxxREFBa0Q7QUFDbEQsb0NBQWlDO0FBQ2pDLGdEQUE2QztBQUU3Qyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBZTlDLElBQWlCLFNBQVMsQ0F1RHpCO0FBdkRELFdBQWlCLFNBQVM7SUFDeEIsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFnQjtRQUN0RCxXQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QixXQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsZUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFKZSxvQkFBVSxhQUl6QixDQUFBO0lBRVksb0JBQVUsR0FBa0MsSUFBSSx1QkFBVSxDQUFDO0lBRXhFLFNBQWdCLE1BQU0sQ0FDcEIsT0FBZ0IsRUFBRSxNQUFjLEVBQUUsSUFBaUIsRUFBRSxLQUFnQjtRQUVyRSxNQUFNLFNBQVMsR0FBRyxVQUFBLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxTQUFTO1lBQ1gsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7aUJBQzdDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQVBlLGdCQUFNLFNBT3JCLENBQUE7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUNwQixPQUFnQixFQUFFLFNBQW9CLEVBQ3RDLE1BQWMsRUFBRSxJQUFpQixFQUFFLEtBQWdCO1FBRW5ELE1BQU0sT0FBTyxHQUFJLGlCQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQztRQUMzQyxNQUFNLElBQUksR0FBTyxNQUFNLHlCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVFLElBQUk7WUFDRixNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQVMsQ0FBQztnQkFDbEMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJO2FBQzdDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87WUFFekIsUUFBUSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLFNBQWtCLEVBQUU7WUFDekIsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxTQUFrQixFQUFFLE9BQWdCO1FBQ2xELElBQUksc0JBQVU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLG1CQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7YUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsU0FBUyxRQUFRLENBQ2YsT0FBZ0IsRUFBRSxRQUF3QixFQUFFLE9BQTZCO1FBRXpFLElBQUksQ0FBQyxRQUFRO1lBQ1gsYUFBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQy9CLElBQUksQ0FBQyxPQUFPO1lBQ2YsaUJBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7QUFDSCxDQUFDLEVBdkRnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXVEekI7QUFBQSxDQUFDIn0=