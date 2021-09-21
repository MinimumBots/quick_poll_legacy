"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
var Session;
(function (Session) {
    function initialize(bot) {
        bot.on('messageReactionAdd', (reaction, user) => validate(reaction, user));
    }
    Session.initialize = initialize;
    const sessions = new Map;
    const cancelEmoji = '↩️';
    function validate(reaction, user) {
        const data = sessions.get(reaction.message.id);
        if (!data)
            return;
        if (reaction.emoji.name === cancelEmoji && user.id === data.user.id)
            cancel(data.id);
    }
    function get(id) {
        return sessions.get(id) ?? null;
    }
    Session.get = get;
    function create(request, response) {
        const id = request.id;
        const data = {
            bot: request.client,
            id: id,
            user: request.author,
            request: request,
            response: response,
            timeout: setTimeout(() => close(id), constants_1.COMMAND_EDITABLE_TIME),
        };
        sessions.set(id, data);
        request.react(cancelEmoji)
            .catch(() => undefined);
        return data;
    }
    Session.create = create;
    function cancel(id) {
        const data = sessions.get(id);
        if (!data)
            return;
        clearTimeout(data.timeout);
        data.response.delete()
            .catch(() => undefined);
        close(id);
    }
    function close(id) {
        const data = sessions.get(id);
        if (!data)
            return;
        data.request.reactions.cache.get(cancelEmoji)?.users.remove()
            .catch(() => undefined);
        utils_1.Utils.removeMessageCache(data.request);
    }
})(Session = exports.Session || (exports.Session = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvYWxsb3R0ZXJzL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsK0NBQXdEO0FBQ3hELG9DQUFpQztBQUVqQyxJQUFpQixPQUFPLENBb0V2QjtBQXBFRCxXQUFpQixPQUFPO0lBQ3RCLFNBQWdCLFVBQVUsQ0FBQyxHQUFXO1FBQ3BDLEdBQUcsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUZlLGtCQUFVLGFBRXpCLENBQUE7SUFXRCxNQUFNLFFBQVEsR0FBeUIsSUFBSSxHQUFHLENBQUM7SUFDL0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBRXpCLFNBQVMsUUFBUSxDQUFDLFFBQWtELEVBQUUsSUFBd0I7UUFDNUYsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUVsQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxTQUFnQixHQUFHLENBQUMsRUFBYTtRQUMvQixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ2xDLENBQUM7SUFGZSxXQUFHLE1BRWxCLENBQUE7SUFFRCxTQUFnQixNQUFNLENBQUMsT0FBZ0IsRUFBRSxRQUFpQjtRQUN4RCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFTO1lBQ2pCLEdBQUcsRUFBTyxPQUFPLENBQUMsTUFBTTtZQUN4QixFQUFFLEVBQVEsRUFBRTtZQUNaLElBQUksRUFBTSxPQUFPLENBQUMsTUFBTTtZQUN4QixPQUFPLEVBQUcsT0FBTztZQUNqQixRQUFRLEVBQUUsUUFBUTtZQUNsQixPQUFPLEVBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxpQ0FBcUIsQ0FBQztTQUM3RCxDQUFBO1FBRUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7YUFDdkIsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQWpCZSxjQUFNLFNBaUJyQixDQUFBO0lBRUQsU0FBUyxNQUFNLENBQUMsRUFBYTtRQUMzQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUVsQixZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2FBQ25CLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUxQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDWixDQUFDO0lBRUQsU0FBUyxLQUFLLENBQUMsRUFBYTtRQUMxQixNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUVsQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDMUQsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFCLGFBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztBQUNILENBQUMsRUFwRWdCLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQW9FdkIifQ==