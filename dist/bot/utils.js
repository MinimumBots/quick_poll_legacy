"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partingText = exports.removeMessageCache = void 0;
function removeMessageCache(message) {
    return message.channel.messages.cache.delete(message.id);
}
exports.removeMessageCache = removeMessageCache;
function partingText(text, limit, prepend = '', append = '') {
    const texts = [];
    let part = prepend;
    for (const line of text.split('\n')) {
        if (part.length + line.length > limit - append.length) {
            texts.push(part + append);
            part = prepend;
        }
        part += line;
    }
    return texts.concat(part + append);
}
exports.partingText = partingText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLFNBQWdCLGtCQUFrQixDQUFDLE9BQWdCO0lBQ2pELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUZELGdEQUVDO0FBRUQsU0FBZ0IsV0FBVyxDQUN6QixJQUFZLEVBQUUsS0FBYSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUU7SUFFdEQsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQzNCLElBQUksSUFBSSxHQUFXLE9BQU8sQ0FBQztJQUUzQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDMUIsSUFBSSxHQUFHLE9BQU8sQ0FBQztTQUNoQjtRQUNELElBQUksSUFBSSxJQUFJLENBQUM7S0FDZDtJQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDckMsQ0FBQztBQWZELGtDQWVDIn0=