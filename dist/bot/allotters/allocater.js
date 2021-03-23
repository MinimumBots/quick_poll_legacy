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
var Allocater;
(function (Allocater) {
    function initialize(bot, botID) {
        help_1.Help.initialize(bot, botID);
        poll_1.Poll.initialize();
        result_1.Result.initialize();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFvRTtBQUVwRSwrQ0FBNkM7QUFDN0MsdUNBQW9DO0FBQ3BDLDZDQUEwQztBQUMxQyxxREFBa0Q7QUFDbEQsb0NBQWlDO0FBQ2pDLGdEQUE2QztBQUU3Qyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLHNEQUFtRDtBQWNuRCxJQUFpQixTQUFTLENBaUV6QjtBQWpFRCxXQUFpQixTQUFTO0lBQ3hCLFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsS0FBZ0I7UUFDdEQsV0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUIsV0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLGVBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBSmUsb0JBQVUsYUFJekIsQ0FBQTtJQUdELE1BQU0sVUFBVSxHQUFlLElBQUksdUJBQVUsQ0FBQztJQUU5QyxTQUFnQixjQUFjLENBQzVCLE1BQWMsRUFBRSxTQUFvQjtRQUVwQyxxQkFBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFMZSx3QkFBYyxpQkFLN0IsQ0FBQTtJQUlELFNBQWdCLE1BQU0sQ0FDcEIsT0FBZ0IsRUFBRSxNQUFjLEVBQUUsSUFBaUIsRUFBRSxLQUFnQjtRQUVyRSxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLElBQUksU0FBUztZQUNYLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDO2lCQUM3QyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFQZSxnQkFBTSxTQU9yQixDQUFBO0lBRUQsS0FBSyxVQUFVLE9BQU8sQ0FDcEIsT0FBZ0IsRUFBRSxTQUFvQixFQUN0QyxNQUFjLEVBQUUsSUFBaUIsRUFBRSxLQUFnQjtRQUVuRCxNQUFNLE9BQU8sR0FBSSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsTUFBTSxRQUFRLEdBQUcsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDM0MsTUFBTSxJQUFJLEdBQU8sTUFBTSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RSxJQUFJO1lBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxTQUFTLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSTthQUM3QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBRXpCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxTQUFrQixFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsU0FBa0IsRUFBRSxPQUFnQjtRQUNsRCxJQUFJLHNCQUFVO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6QyxtQkFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO2FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQVMsUUFBUSxDQUNmLE9BQWdCLEVBQUUsUUFBd0IsRUFBRSxPQUE2QjtRQUV6RSxJQUFJLENBQUMsUUFBUTtZQUNYLGFBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMvQixJQUFJLENBQUMsT0FBTztZQUNmLGlCQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0FBQ0gsQ0FBQyxFQWpFZ0IsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFpRXpCO0FBQUEsQ0FBQyJ9