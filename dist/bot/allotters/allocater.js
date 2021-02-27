"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allocater = void 0;
const discord_js_1 = require("discord.js");
const session_1 = __importDefault(require("./session"));
const help_1 = require("../responders/help");
const rejecter_1 = require("../responders/rejecter");
const utils_1 = require("../utils");
exports.Allocater = {
    initialize(bot) {
        help_1.Help.initialize(bot);
    },
    responders: new discord_js_1.Collection,
    sessions: new discord_js_1.Collection,
    submit(request, prefix, args) {
        const responder = this.responders.get(prefix);
        console.log(responder);
        if (responder)
            this.respond(request, responder, args);
    },
    respond(request, responder, args) {
        const session = this.sessions.get(request.id);
        const response = session?.response;
        responder(request, args, response)
            .then(response => this.allocate(request, response, session))
            .catch(exception => this.exception(exception, request));
    },
    exception(exception, request) {
        rejecter_1.Rejecter.issue(exception, request)
            .then(response => response && this.allocate(request, response))
            .catch(console.error);
    },
    allocate(request, response, session) {
        if (!response)
            utils_1.removeMessageCache(request);
        else if (!session)
            this.sessions.set(request.id, new session_1.default(request, response, this.free));
    },
    free(requestID) {
        this.sessions.delete(requestID);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb2NhdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9hbGxvdHRlcnMvYWxsb2NhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJDQUFvRTtBQUVwRSx3REFBZ0M7QUFDaEMsNkNBQTBDO0FBQzFDLHFEQUFrRDtBQUNsRCxvQ0FBOEM7QUFPakMsUUFBQSxTQUFTLEdBYWxCO0lBQ0YsVUFBVSxDQUFDLEdBQUc7UUFDWixXQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxVQUFVLEVBQUUsSUFBSSx1QkFBVTtJQUMxQixRQUFRLEVBQUksSUFBSSx1QkFBVTtJQUUxQixNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJO1FBQzFCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsSUFBSSxTQUFTO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJO1FBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxNQUFNLFFBQVEsR0FBRyxPQUFPLEVBQUUsUUFBUSxDQUFDO1FBRW5DLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQzthQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDM0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPO1FBQzFCLG1CQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7YUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQzlELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU87UUFDakMsSUFBSSxDQUFDLFFBQVE7WUFDWCwwQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN6QixJQUFJLENBQUMsT0FBTztZQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxpQkFBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUNELElBQUksQ0FBQyxTQUFTO1FBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGLENBQUMifQ==