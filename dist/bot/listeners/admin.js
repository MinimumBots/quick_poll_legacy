"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.Admin = {
    initialize(bot) {
        bot.on('message', () => this.processing);
    },
    processing(message) {
        if (!this.validate(message))
            return;
        this.eval(message);
    },
    validate(message) {
        return constants_1.BOT_OWNER_IDS.some(id => id === message.author.id);
    },
    eval(message) {
        if (message.channel.type !== 'dm')
            return;
        const match = message.content.match(/^\/admin ```\n?(.+?)\n?```$/m);
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
        this.respondLog(message.channel, log);
    },
    respondLog(channel, log) {
        const logs = utils_1.partingText(log, 2000, '```', '```');
        Promise.all(logs.map(channel.send))
            .catch(console.error);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2xpc3RlbmVycy9hZG1pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw0Q0FBNkM7QUFDN0Msb0NBQXVDO0FBRTFCLFFBQUEsS0FBSyxHQU9kO0lBQ0YsVUFBVSxDQUFDLEdBQUc7UUFDWixHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFPO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU87UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBQ0QsUUFBUSxDQUFDLE9BQU87UUFDZCxPQUFPLHlCQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFPO1FBQ1YsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQUUsT0FBTztRQUUxQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixJQUFJLEdBQVcsQ0FBQztRQUVoQixJQUFJO1lBQ0YsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLFlBQVksS0FBSztnQkFDcEIsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7Z0JBRTNCLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNELFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRztRQUNyQixNQUFNLElBQUksR0FBRyxtQkFBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0YsQ0FBQSJ9