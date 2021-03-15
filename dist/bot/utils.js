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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUE0RTtBQUU1RSxJQUFpQixLQUFLLENBOERyQjtBQTlERCxXQUFpQixLQUFLO0lBQ2IsS0FBSyxVQUFVLFlBQVksQ0FBQyxPQUFnQjtRQUNqRCxJQUFJO1lBQ0YsT0FBTyxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM5QjtRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLDRCQUFlO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBQ2xELE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBUnFCLGtCQUFZLGVBUWpDLENBQUE7SUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxPQUFnQjtRQUNqRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFGZSx3QkFBa0IscUJBRWpDLENBQUE7SUFFRCxTQUFnQixXQUFXLENBQ3pCLElBQVksRUFBRSxLQUFhLEVBQUUsT0FBZSxFQUFFLE1BQWM7UUFFNUQsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxHQUFXLE9BQU8sQ0FBQztRQUUzQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUs7Z0JBQ3JCLE1BQU0sSUFBSSxVQUFVLENBQ2xCLDBEQUEwRCxLQUFLLEdBQUcsQ0FDbkUsQ0FBQztZQUVKLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNyRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ2pDLElBQUksR0FBRyxPQUFPLENBQUM7YUFDaEI7WUFDRCxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFwQmUsaUJBQVcsY0FvQjFCLENBQUE7SUFFRCxLQUFLLFVBQVUsZUFBZSxDQUFDLEdBQVc7UUFDeEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdkUsTUFBTSxLQUFLLEdBQUcsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3ZFLENBQUM7SUFFTSxLQUFLLFVBQVUsY0FBYyxDQUNsQyxHQUFXLEVBQUUsS0FBYTtRQUUxQixJQUFJLElBQWtCLEVBQUUsSUFBWSxDQUFDO1FBRXJDLFFBQVEsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNqQixLQUFLLENBQUM7Z0JBQ0osSUFBSSxHQUFHLFdBQVcsQ0FBQztnQkFDbkIsSUFBSSxHQUFHLEdBQUcsTUFBTSxlQUFlLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDNUMsTUFBTTtZQUVSO2dCQUNFLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQ2pCLElBQUksR0FBRyxpQkFBaUIsQ0FBQztnQkFDekIsTUFBTTtTQUNUO1FBRUQsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBbEJxQixvQkFBYyxpQkFrQm5DLENBQUE7QUFDSCxDQUFDLEVBOURnQixLQUFLLEdBQUwsYUFBSyxLQUFMLGFBQUssUUE4RHJCIn0=