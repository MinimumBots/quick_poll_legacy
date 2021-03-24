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
const fool_1 = require("../responders/fool");
var Allocater;
(function (Allocater) {
    function initialize(bot, botID) {
        help_1.Help.initialize(bot, botID);
        poll_1.Poll.initialize();
        result_1.Result.initialize();
        export_1.Export.initialize();
        fool_1.Fool.initialize();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFvRTtBQUVwRSwrQ0FBNkM7QUFDN0MsdUNBQW9DO0FBQ3BDLDZDQUEwQztBQUMxQyxxREFBa0Q7QUFDbEQsb0NBQWlDO0FBQ2pDLGdEQUE2QztBQUU3Qyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLHNEQUFtRDtBQUNuRCxpREFBOEM7QUFDOUMsNkNBQTBDO0FBYTFDLElBQWlCLFNBQVMsQ0FvRXpCO0FBcEVELFdBQWlCLFNBQVM7SUFDeEIsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFnQjtRQUN0RCxXQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QixXQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsZUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLGVBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNwQixXQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQU5lLG9CQUFVLGFBTXpCLENBQUE7SUFJRCxNQUFNLFVBQVUsR0FBZSxJQUFJLHVCQUFVLENBQUM7SUFFOUMsU0FBZ0IsY0FBYyxDQUM1QixNQUFjLEVBQUUsU0FBb0I7UUFFcEMscUJBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBTGUsd0JBQWMsaUJBSzdCLENBQUE7SUFJRCxTQUFnQixNQUFNLENBQ3BCLE9BQWdCLEVBQUUsTUFBYyxFQUFFLElBQWlCLEVBQUUsS0FBZ0I7UUFFckUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVM7WUFDWCxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztpQkFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBUGUsZ0JBQU0sU0FPckIsQ0FBQTtJQUVELEtBQUssVUFBVSxPQUFPLENBQ3BCLE9BQWdCLEVBQUUsU0FBb0IsRUFDdEMsTUFBYyxFQUFFLElBQWlCLEVBQUUsS0FBZ0I7UUFFbkQsTUFBTSxPQUFPLEdBQUksaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLE9BQU8sRUFBRSxRQUFRLElBQUksSUFBSSxDQUFDO1FBQzNDLE1BQU0sSUFBSSxHQUFPLE1BQU0seUJBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUUsSUFBSTtZQUNGLE1BQU0sV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUk7YUFDN0MsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTztZQUV6QixRQUFRLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN6QztRQUNELE9BQU8sU0FBa0IsRUFBRTtZQUN6QixNQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELFNBQVMsTUFBTSxDQUFDLFNBQWtCLEVBQUUsT0FBZ0I7UUFDbEQsSUFBSSxzQkFBVTtZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsbUJBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzthQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FDZixPQUFnQixFQUFFLFFBQXdCLEVBQUUsT0FBNkI7UUFFekUsSUFBSSxDQUFDLFFBQVE7WUFDWCxhQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDL0IsSUFBSSxDQUFDLE9BQU87WUFDZixpQkFBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztBQUNILENBQUMsRUFwRWdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBb0V6QjtBQUFBLENBQUMifQ==