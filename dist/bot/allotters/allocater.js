"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allocater = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const session_1 = __importDefault(require("./session"));
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
    const sessions = new discord_js_1.Collection;
    function submit(request, prefix, args, botID) {
        const responder = Allocater.responders.get(prefix);
        if (responder)
            respond(request, responder, prefix, args, botID)
                .catch(console.error);
    }
    Allocater.submit = submit;
    async function respond(request, responder, prefix, args, botID) {
        const session = sessions.get(request.id);
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
            sessions.set(request.id, new session_1.default(request, response, id => free(id)));
    }
    function free(requestID) {
        sessions.delete(requestID);
    }
})(Allocater = exports.Allocater || (exports.Allocater = {}));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUFvRTtBQUVwRSwrQ0FBNkM7QUFDN0Msd0RBQWdDO0FBQ2hDLDZDQUEwQztBQUMxQyxxREFBa0Q7QUFDbEQsb0NBQWlDO0FBQ2pDLGdEQUE2QztBQUU3Qyw2Q0FBMEM7QUFDMUMsaURBQThDO0FBZTlDLElBQWlCLFNBQVMsQ0E4RHpCO0FBOURELFdBQWlCLFNBQVM7SUFDeEIsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxLQUFnQjtRQUN0RCxXQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QixXQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsZUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFKZSxvQkFBVSxhQUl6QixDQUFBO0lBRVksb0JBQVUsR0FBa0MsSUFBSSx1QkFBVSxDQUFDO0lBQ3hFLE1BQU0sUUFBUSxHQUFtQyxJQUFJLHVCQUFVLENBQUM7SUFFaEUsU0FBZ0IsTUFBTSxDQUNwQixPQUFnQixFQUFFLE1BQWMsRUFBRSxJQUFpQixFQUFFLEtBQWdCO1FBRXJFLE1BQU0sU0FBUyxHQUFHLFVBQUEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVM7WUFDWCxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQztpQkFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBUGUsZ0JBQU0sU0FPckIsQ0FBQTtJQUVELEtBQUssVUFBVSxPQUFPLENBQ3BCLE9BQWdCLEVBQUUsU0FBb0IsRUFDdEMsTUFBYyxFQUFFLElBQWlCLEVBQUUsS0FBZ0I7UUFFbkQsTUFBTSxPQUFPLEdBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxRQUFRLEdBQUcsT0FBTyxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDM0MsTUFBTSxJQUFJLEdBQU8sTUFBTSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1RSxJQUFJO1lBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxTQUFTLENBQUM7Z0JBQ2xDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSTthQUM3QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBRXpCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxTQUFrQixFQUFFO1lBQ3pCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsU0FBa0IsRUFBRSxPQUFnQjtRQUNsRCxJQUFJLHNCQUFVO1lBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6QyxtQkFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO2FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3pELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFNBQVMsUUFBUSxDQUNmLE9BQWdCLEVBQUUsUUFBd0IsRUFBRSxPQUFpQjtRQUU3RCxJQUFJLENBQUMsUUFBUTtZQUNYLGFBQUssQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMvQixJQUFJLENBQUMsT0FBTztZQUNmLFFBQVEsQ0FBQyxHQUFHLENBQ1YsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLGlCQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUMzRCxDQUFDO0lBQ04sQ0FBQztJQUVELFNBQVMsSUFBSSxDQUFDLFNBQW9CO1FBQ2hDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0IsQ0FBQztBQUNILENBQUMsRUE5RGdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBOER6QjtBQUFBLENBQUMifQ==