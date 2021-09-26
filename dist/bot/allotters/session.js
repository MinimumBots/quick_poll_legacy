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
