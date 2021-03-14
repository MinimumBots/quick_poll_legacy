"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils;
(function (Utils) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLElBQWlCLEtBQUssQ0FvRHJCO0FBcERELFdBQWlCLEtBQUs7SUFDcEIsU0FBZ0Isa0JBQWtCLENBQUMsT0FBZ0I7UUFDakQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRmUsd0JBQWtCLHFCQUVqQyxDQUFBO0lBRUQsU0FBZ0IsV0FBVyxDQUN6QixJQUFZLEVBQUUsS0FBYSxFQUFFLE9BQWUsRUFBRSxNQUFjO1FBRTVELE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksR0FBVyxPQUFPLENBQUM7UUFFM0IsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25DLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLO2dCQUNyQixNQUFNLElBQUksVUFBVSxDQUNsQiwwREFBMEQsS0FBSyxHQUFHLENBQ25FLENBQUM7WUFFSixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUM7U0FDckI7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBcEJlLGlCQUFXLGNBb0IxQixDQUFBO0lBRUQsS0FBSyxVQUFVLGVBQWUsQ0FBQyxHQUFXO1FBQ3hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN2RSxDQUFDO0lBRU0sS0FBSyxVQUFVLGNBQWMsQ0FDbEMsR0FBVyxFQUFFLEtBQWE7UUFFMUIsSUFBSSxJQUFrQixFQUFFLElBQVksQ0FBQztRQUVyQyxRQUFRLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDakIsS0FBSyxDQUFDO2dCQUNKLElBQUksR0FBRyxXQUFXLENBQUM7Z0JBQ25CLElBQUksR0FBRyxHQUFHLE1BQU0sZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQzVDLE1BQU07WUFFUjtnQkFDRSxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUNqQixJQUFJLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ3pCLE1BQU07U0FDVDtRQUVELE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQWxCcUIsb0JBQWMsaUJBa0JuQyxDQUFBO0FBQ0gsQ0FBQyxFQXBEZ0IsS0FBSyxHQUFMLGFBQUssS0FBTCxhQUFLLFFBb0RyQiJ9