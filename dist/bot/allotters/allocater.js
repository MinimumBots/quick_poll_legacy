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
const decrypter_1 = require("../listeners/decrypter");
const export_1 = require("../responders/export");
var Allocater;
(function (Allocater) {
    function initialize(bot, botID) {
        help_1.Help.initialize(bot, botID);
        poll_1.Poll.initialize();
        result_1.Result.initialize();
        export_1.Export.initialize();
    }
    Allocater.initialize = initialize;
    const responders = new discord_js_1.Collection;
    function entryResponder(header, responder) {
        decrypter_1.Decrypter.entryHeader(header);
        return responders.set(header, responder);
    }
    Allocater.entryResponder = entryResponder;
    function submit(request, header, args, botID) {
        const responder = responders.get(header);
        if (responder)
            respond(request, responder, header, args, botID)
                .catch(console.error);
    }
    Allocater.submit = submit;
    async function respond(request, responder, header, args, botID) {
        const session = session_1.Session.get(request.id);
        const response = session?.response ?? null;
        const lang = await preferences_1.Preferences.fetchLang(request.author, request.guild);
        try {
            const newResponse = await responder({
                botID, request, header, args, response, lang
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFvRTtBQUVwRSwrQ0FBNkM7QUFDN0MsdUNBQW9DO0FBQ3BDLDZDQUEwQztBQUMxQyxxREFBa0Q7QUFDbEQsb0NBQWlDO0FBQ2pDLGdEQUE2QztBQUU3Qyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLHNEQUFtRDtBQUNuRCxpREFBOEM7QUFhOUMsSUFBaUIsU0FBUyxDQW1FekI7QUFuRUQsV0FBaUIsU0FBUztJQUN4QixTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLEtBQWdCO1FBQ3RELFdBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVCLFdBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixlQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEIsZUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFMZSxvQkFBVSxhQUt6QixDQUFBO0lBSUQsTUFBTSxVQUFVLEdBQWUsSUFBSSx1QkFBVSxDQUFDO0lBRTlDLFNBQWdCLGNBQWMsQ0FDNUIsTUFBYyxFQUFFLFNBQW9CO1FBRXBDLHFCQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUxlLHdCQUFjLGlCQUs3QixDQUFBO0lBSUQsU0FBZ0IsTUFBTSxDQUNwQixPQUFnQixFQUFFLE1BQWMsRUFBRSxJQUFpQixFQUFFLEtBQWdCO1FBRXJFLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxTQUFTO1lBQ1gsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7aUJBQzdDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQVBlLGdCQUFNLFNBT3JCLENBQUE7SUFFRCxLQUFLLFVBQVUsT0FBTyxDQUNwQixPQUFnQixFQUFFLFNBQW9CLEVBQ3RDLE1BQWMsRUFBRSxJQUFpQixFQUFFLEtBQWdCO1FBRW5ELE1BQU0sT0FBTyxHQUFJLGlCQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxPQUFPLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQztRQUMzQyxNQUFNLElBQUksR0FBTyxNQUFNLHlCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVFLElBQUk7WUFDRixNQUFNLFdBQVcsR0FBRyxNQUFNLFNBQVMsQ0FBQztnQkFDbEMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJO2FBQzdDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87WUFFekIsUUFBUSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLFNBQWtCLEVBQUU7WUFDekIsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxTQUFrQixFQUFFLE9BQWdCO1FBQ2xELElBQUksc0JBQVU7WUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLG1CQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7YUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7YUFDekQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsU0FBUyxRQUFRLENBQ2YsT0FBZ0IsRUFBRSxRQUF3QixFQUFFLE9BQTZCO1FBRXpFLElBQUksQ0FBQyxRQUFRO1lBQ1gsYUFBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQy9CLElBQUksQ0FBQyxPQUFPO1lBQ2YsaUJBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7QUFDSCxDQUFDLEVBbkVnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQW1FekI7QUFBQSxDQUFDIn0=