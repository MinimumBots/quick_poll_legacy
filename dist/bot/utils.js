"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const discord_js_1 = require("discord.js");
var Utils;
(function (Utils) {
    async function fetchMessage(message) {
        try {
            return await message.fetch();
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError)
                if (error.code / 400 > 1)
                    return null;
            throw error;
        }
    }
    Utils.fetchMessage = fetchMessage;
    function removeMessageCache(message) {
        return message.channel.messages.cache.delete(message.id);
    }
    Utils.removeMessageCache = removeMessageCache;
    function partingText(text, limit, prepend, append) {
        const texts = [];
        let part = prepend;
        for (const line of text.split('\n')) {
            if (line.length > limit)
                throw new RangeError(`The number of characters per line exceeds the limit of ${limit}.`);
            if (part.length + line.length > limit - append.length) {
                texts.push(`${part}\n${append}`);
                part = prepend;
            }
            part += `\n${line}`;
        }
        return texts.concat(`${part}\n${append}`);
    }
    Utils.partingText = partingText;
    async function fetchGuildCount(bot) {
        const counts = await bot.shard?.fetchClientValues('guilds.cache.size');
        const count = counts?.reduce((a, b) => a + b, 0);
        return typeof count === 'number' && count > 0 ? `${count}` : 'いくつかの';
    }
    async function updatePresence(bot, count) {
        let type, name;
        switch (count % 2) {
            case 1:
                type = 'COMPETING';
                name = `${await fetchGuildCount(bot)} サーバー`;
                break;
            default:
                type = 'PLAYING';
                name = '/poll | /expoll';
                break;
        }
        await bot.user?.setPresence({ status: 'online', activity: { type, name } });
    }
    Utils.updatePresence = updatePresence;
})(Utils = exports.Utils || (exports.Utils = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUE0RTtBQUU1RSxJQUFpQixLQUFLLENBZ0VyQjtBQWhFRCxXQUFpQixLQUFLO0lBQ2IsS0FBSyxVQUFVLFlBQVksQ0FBQyxPQUFnQjtRQUNqRCxJQUFJO1lBQ0YsT0FBTyxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM5QjtRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLDRCQUFlO2dCQUNsQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFeEMsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7SUFWcUIsa0JBQVksZUFVakMsQ0FBQTtJQUVELFNBQWdCLGtCQUFrQixDQUFDLE9BQWdCO1FBQ2pELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUZlLHdCQUFrQixxQkFFakMsQ0FBQTtJQUVELFNBQWdCLFdBQVcsQ0FDekIsSUFBWSxFQUFFLEtBQWEsRUFBRSxPQUFlLEVBQUUsTUFBYztRQUU1RCxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLEdBQVcsT0FBTyxDQUFDO1FBRTNCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSztnQkFDckIsTUFBTSxJQUFJLFVBQVUsQ0FDbEIsMERBQTBELEtBQUssR0FBRyxDQUNuRSxDQUFDO1lBRUosSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDakMsSUFBSSxHQUFHLE9BQU8sQ0FBQzthQUNoQjtZQUNELElBQUksSUFBSSxLQUFLLElBQUksRUFBRSxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQXBCZSxpQkFBVyxjQW9CMUIsQ0FBQTtJQUVELEtBQUssVUFBVSxlQUFlLENBQUMsR0FBVztRQUN4QyxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN2RSxNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDdkUsQ0FBQztJQUVNLEtBQUssVUFBVSxjQUFjLENBQ2xDLEdBQVcsRUFBRSxLQUFhO1FBRTFCLElBQUksSUFBa0IsRUFBRSxJQUFZLENBQUM7UUFFckMsUUFBUSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLEtBQUssQ0FBQztnQkFDSixJQUFJLEdBQUcsV0FBVyxDQUFDO2dCQUNuQixJQUFJLEdBQUcsR0FBRyxNQUFNLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2dCQUM1QyxNQUFNO1lBRVI7Z0JBQ0UsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDakIsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUN6QixNQUFNO1NBQ1Q7UUFFRCxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFsQnFCLG9CQUFjLGlCQWtCbkMsQ0FBQTtBQUNILENBQUMsRUFoRWdCLEtBQUssR0FBTCxhQUFLLEtBQUwsYUFBSyxRQWdFckIifQ==