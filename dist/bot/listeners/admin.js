"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
var Admin;
(function (Admin) {
    function initialize(bot) {
        bot.on('message', message => processing(message));
    }
    Admin.initialize = initialize;
    function processing(message) {
        if (!validate(message))
            return;
        evaluate(message);
    }
    function validate(message) {
        return constants_1.BOT_OWNER_IDS.some(id => id === message.author.id);
    }
    function evaluate(message) {
        if (message.channel.type !== 'dm')
            return;
        const match = message.content.match(/^\/eval\s*?```\s*?(.+?)\s*?```$/m);
        if (!match)
            return;
        let log;
        try {
            log = String(eval(match[1]));
        }
        catch (e) {
            if (e instanceof Error)
                log = e.stack ?? e.message;
            else
                log = String(e);
        }
        respondLog(message.channel, log);
    }
    function respondLog(channel, log) {
        const logs = utils_1.Utils.partingText(log, 2000, '```', '```');
        Promise.all(logs.map(log => channel.send(log)))
            .catch(console.error);
    }
})(Admin = exports.Admin || (exports.Admin = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2xpc3RlbmVycy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrQ0FBZ0Q7QUFDaEQsb0NBQWlDO0FBRWpDLElBQWlCLEtBQUssQ0F5Q3JCO0FBekNELFdBQWlCLEtBQUs7SUFDcEIsU0FBZ0IsVUFBVSxDQUFDLEdBQVc7UUFDcEMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRmUsZ0JBQVUsYUFFekIsQ0FBQTtJQUVELFNBQVMsVUFBVSxDQUFDLE9BQWdCO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQUUsT0FBTztRQUMvQixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELFNBQVMsUUFBUSxDQUFDLE9BQWdCO1FBQ2hDLE9BQU8seUJBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsU0FBUyxRQUFRLENBQUMsT0FBZ0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQUUsT0FBTztRQUUxQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixJQUFJLEdBQVcsQ0FBQztRQUVoQixJQUFJO1lBQ0YsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLFlBQVksS0FBSztnQkFDcEIsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7Z0JBRTNCLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFFRCxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsU0FBUyxVQUFVLENBQUMsT0FBa0IsRUFBRSxHQUFXO1FBQ2pELE1BQU0sSUFBSSxHQUFHLGFBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzVDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztBQUNILENBQUMsRUF6Q2dCLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQXlDckIifQ==