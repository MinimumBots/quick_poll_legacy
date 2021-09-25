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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvYWxsb3R0ZXJzL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsK0NBQXdEO0FBQ3hELG9DQUFpQztBQUVqQyxJQUFpQixPQUFPLENBb0V2QjtBQXBFRCxXQUFpQixPQUFPO0lBQ3RCLFNBQWdCLFVBQVUsQ0FBQyxHQUFpQjtRQUMxQyxHQUFHLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFGZSxrQkFBVSxhQUV6QixDQUFBO0lBV0QsTUFBTSxRQUFRLEdBQXlCLElBQUksR0FBRyxDQUFDO0lBQy9DLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQztJQUV6QixTQUFTLFFBQVEsQ0FBQyxRQUFrRCxFQUFFLElBQXdCO1FBQzVGLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsU0FBZ0IsR0FBRyxDQUFDLEVBQWE7UUFDL0IsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRmUsV0FBRyxNQUVsQixDQUFBO0lBRUQsU0FBZ0IsTUFBTSxDQUFDLE9BQWdCLEVBQUUsUUFBaUI7UUFDeEQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUN0QixNQUFNLElBQUksR0FBUztZQUNqQixHQUFHLEVBQU8sT0FBTyxDQUFDLE1BQU07WUFDeEIsRUFBRSxFQUFRLEVBQUU7WUFDWixJQUFJLEVBQU0sT0FBTyxDQUFDLE1BQU07WUFDeEIsT0FBTyxFQUFHLE9BQU87WUFDakIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsT0FBTyxFQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsaUNBQXFCLENBQUM7U0FDN0QsQ0FBQTtRQUVELFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQ3ZCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUxQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFqQmUsY0FBTSxTQWlCckIsQ0FBQTtJQUVELFNBQVMsTUFBTSxDQUFDLEVBQWE7UUFDM0IsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTthQUNuQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELFNBQVMsS0FBSyxDQUFDLEVBQWE7UUFDMUIsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFFbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO2FBQzFELEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUxQixhQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7QUFDSCxDQUFDLEVBcEVnQixPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFvRXZCIn0=