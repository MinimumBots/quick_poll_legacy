"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
class Session {
    constructor(request, response, terminater) {
        this.request = request;
        this.response = response;
        this.terminater = terminater;
        this.cancelEmoji = '↩️';
        this.onCancel = (reaction, user) => {
            if (reaction.emoji.name === this.cancelEmoji && user.id === this.user.id)
                this.cancel();
        };
        this.id = request.id;
        this.user = request.author;
        this.bot = request.client;
        request.react(this.cancelEmoji)
            .catch(console.error);
        this.bot.on('messageReactionAdd', this.onCancel);
        this.timeout = this.bot.setTimeout(() => this.close(), constants_1.COMMAND_EDITABLE_TIME);
    }
    cancel() {
        if (this.timeout)
            this.bot.clearTimeout(this.timeout);
        this.response.delete()
            .catch(console.error);
        this.close();
    }
    close() {
        this.bot.off('messageReactionAdd', this.onCancel);
        this.request.reactions.cache.get(this.cancelEmoji)?.users.remove()
            .catch(console.error);
        utils_1.Utils.removeMessageCache(this.request);
        this.terminater(this.id);
    }
}
exports.default = Session;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvYWxsb3R0ZXJzL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQ0FBd0Q7QUFDeEQsb0NBQWlDO0FBSWpDLE1BQXFCLE9BQU87SUFDMUIsWUFDbUIsT0FBbUIsRUFDbkIsUUFBbUIsRUFDbkIsVUFBc0I7UUFGdEIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFxQnhCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBVzVCLGFBQVEsR0FBRyxDQUNqQixRQUF5QixFQUFFLElBQXdCLEVBQzdDLEVBQUU7WUFDUixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUE7UUFuQ0MsSUFBSSxDQUFDLEVBQUUsR0FBSyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFM0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQ2hDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxpQ0FBcUIsQ0FDMUMsQ0FBQztJQUNKLENBQUM7SUFVRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsT0FBTztZQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV0RCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTthQUNuQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFTRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDL0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QixhQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQXJERCwwQkFxREMifQ==