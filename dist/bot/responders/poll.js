"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const path_1 = require("path");
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const locale_1 = require("../templates/locale");
const allocater_1 = require("../allotters/allocater");
const error_1 = __importDefault(require("./error"));
const help_1 = require("./help");
var Poll;
(function (Poll) {
    const pollPermissions = [
        'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'
    ];
    const exclusivePermissions = [
        'MANAGE_MESSAGES'
    ];
    const externalPermissions = [
        'USE_EXTERNAL_EMOJIS'
    ];
    const mentionPermissions = [
        'MENTION_EVERYONE'
    ];
    const attachImagePermissions = [
        'ATTACH_FILES'
    ];
    function sumRequireAuthoerPermissions(query, permissions) {
        return query.mentions.length && permissions.has(mentionPermissions)
            ? mentionPermissions : [];
    }
    function sumRequireMyPermissions(query) {
        const permissions = pollPermissions;
        if (query.exclusive)
            permissions.push(...exclusivePermissions);
        if (query.choices.some(choice => choice.external))
            permissions.push(...externalPermissions);
        if (query.imageURL)
            permissions.push(...attachImagePermissions);
        return permissions;
    }
    function validateAuthorPermissions(data, query, permissions) {
        const requirePermissions = sumRequireAuthoerPermissions(query, permissions);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackYourPermissions', data.lang, missingPermissions);
        return true;
    }
    function validateMyPermissions(data, query, permissions) {
        const requirePermissions = sumRequireMyPermissions(query);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackPermissions', data.lang, missingPermissions);
        return true;
    }
    function validatePermissions(data, query) {
        const request = data.request;
        const channel = request.channel;
        const myPermissions = channel.type === 'dm'
            ? new discord_js_1.Permissions(constants_1.ASSUMING_DM_PERMISSIONS)
            : channel.permissionsFor(data.botID);
        const authorPermissions = channel.type === 'dm'
            ? new discord_js_1.Permissions(constants_1.ASSUMING_DM_PERMISSIONS)
            : channel.permissionsFor(request.author);
        if (!myPermissions || !authorPermissions)
            return false;
        return (validateMyPermissions(data, query, myPermissions)
            && validateAuthorPermissions(data, query, authorPermissions));
    }
    function isLocalGuildEmoji(guild, emoji) {
        const match = emoji.match(/^<a?:.+?:(\d+)>$/);
        return guild && match ? guild.emojis.cache.has(match[1]) : false;
    }
    const defaultEmojis = [
        '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲',
        '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
    ];
    const twemojiRegex = require('twemoji-parser/dist/lib/regex.js').default;
    const emojiRegex = new RegExp(`^(${twemojiRegex.toString().slice(1, -2)}|<a?:.+?:\\d+>)$`);
    const twoChoiceEmojis = ['⭕', '❌'];
    function generateChoices(data) {
        const emojis = [], texts = [];
        let external = false;
        data.args.forEach(arg => {
            if (emojiRegex.test(arg)) {
                const length = emojis.push(arg);
                if (texts.length < length - 1)
                    texts.push(null);
                external || (external = !isLocalGuildEmoji(data.request.guild, arg));
            }
            else {
                const length = texts.push(arg);
                if (emojis.length < length)
                    emojis.push(defaultEmojis[length - 1]);
            }
        });
        return emojis.map((emoji, i) => ({ emoji, text: texts[i], external }));
    }
    function generateTwoChoices() {
        return twoChoiceEmojis.map(emoji => ({ emoji: emoji, text: null, external: false }));
    }
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    function parseChoices(data) {
        if (!data.args.length)
            return generateTwoChoices();
        return generateChoices(data);
    }
    function parseQuestion(data) {
        return data.args.shift() ?? null;
    }
    function parseMentions(data) {
        const mentions = [];
        for (const arg of data.args) {
            const matchMention = arg.match(/^(@everyone|@here|<@&\d+>)$/);
            const matchEvery = arg.match(/^(?!\\)(everyone|here)$/);
            const matchNumber = arg.match(/^(?!\\)(\d+)$/);
            if (!matchMention && !matchEvery && !matchNumber)
                break;
            if (matchMention)
                mentions.push(matchMention[1]);
            if (matchEvery)
                mentions.push(`@${matchEvery[1]}`);
            if (matchNumber)
                mentions.push(`<@&${matchNumber[1]}>`);
        }
        mentions.forEach(() => data.args.shift());
        return mentions;
    }
    function parseAttachedImage(data) {
        return data.request.attachments.find(attachment => imageExtensions.includes(path_1.extname(attachment.url)))?.url ?? null;
    }
    function parseAuthor(data) {
        const user = data.request.author;
        const member = data.request.member;
        return {
            iconURL: user.displayAvatarURL(),
            name: member?.displayName ?? user.username,
        };
    }
    function parse(data, exclusive) {
        const query = {
            exclusive: exclusive,
            author: parseAuthor(data),
            imageURL: parseAttachedImage(data),
            mentions: parseMentions(data),
            question: parseQuestion(data),
            choices: parseChoices(data),
        };
        if (query.mentions.length && query.question === null)
            throw new error_1.default('ungivenQuestion', data.lang);
        return query;
    }
    function respondError(data, error) {
        const options = { embed: error.embed };
        const channel = data.request.channel;
        const response = data.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function respondPoll(data, query, response) {
        const choices = query.choices;
        const selectors = choices.some(choice => choice.text !== null)
            ? choices.map(choice => choice.emoji) : [];
        return response.edit(query.mentions.join(' '), {
            embed: locale_1.Locales[data.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? path_1.basename(query.imageURL) : null, response.id)
        });
    }
    async function attachSelectors(data, query, response) {
        try {
            await Promise.all(query.choices.map(choice => response.react(choice.emoji)));
        }
        catch (exception) {
            if (exception instanceof discord_js_1.DiscordAPIError)
                if (exception.code === 400)
                    throw new error_1.default('unusableEmoji', data.lang);
        }
    }
    function respondLoading(data, query) {
        return data.request.channel.send(query.mentions.join(' '), { embed: locale_1.Locales[data.lang].loadings.poll() });
    }
    function respondHelp(data) {
        const options = { content: '', embed: help_1.Help.getEmbed(data.lang) };
        const channel = data.request.channel;
        const response = data.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function clearSelectors(response) {
        response.reactions.removeAll()
            .catch(console.error);
    }
    async function respond(data, exclusive) {
        if (data.response)
            clearSelectors(data.response);
        if (!data.args.length)
            return respondHelp(data);
        try {
            const query = parse(data, exclusive);
            if (!validatePermissions(data, query))
                return null;
            data.response ?? (data.response = await respondLoading(data, query));
            await attachSelectors(data, query, data.response);
            return respondPoll(data, query, data.response);
        }
        catch (error) {
            if (error instanceof error_1.default)
                return respondError(data, error);
            throw error;
        }
    }
    function initialize() {
        allocater_1.Allocater.responders.set(`${constants_1.COMMAND_PREFIX}poll`, data => respond(data, false));
        allocater_1.Allocater.responders.set(`${constants_1.COMMAND_PREFIX}expoll`, data => respond(data, true));
    }
    Poll.initialize = initialize;
})(Poll = exports.Poll || (exports.Poll = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUF5QztBQUN6QywyQ0FNb0I7QUFFcEIsK0NBQTBFO0FBQzFFLGdEQUE4QztBQUM5QyxzREFBZ0U7QUFDaEUsb0RBQW1DO0FBQ25DLGlDQUE4QjtBQUU5QixJQUFpQixJQUFJLENBc1NwQjtBQXRTRCxXQUFpQixJQUFJO0lBYW5CLE1BQU0sZUFBZSxHQUF1QjtRQUMxQyxlQUFlLEVBQUUsc0JBQXNCO0tBQ3hDLENBQUM7SUFDRixNQUFNLG9CQUFvQixHQUF1QjtRQUMvQyxpQkFBaUI7S0FDbEIsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQXVCO1FBQzlDLHFCQUFxQjtLQUN0QixDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBdUI7UUFDN0Msa0JBQWtCO0tBQ25CLENBQUM7SUFDRixNQUFNLHNCQUFzQixHQUF1QjtRQUNqRCxjQUFjO0tBQ2YsQ0FBQztJQUVGLFNBQVMsNEJBQTRCLENBQ25DLEtBQVksRUFBRSxXQUFrQztRQUVoRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7WUFDakUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBWTtRQUMzQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUM7UUFFcEMsSUFBSSxLQUFLLENBQUMsU0FBUztZQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxDQUFDLFFBQVE7WUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztRQUVoRSxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyx5QkFBeUIsQ0FDaEMsSUFBaUIsRUFBRSxLQUFZLEVBQUUsV0FBa0M7UUFFbkUsTUFBTSxrQkFBa0IsR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUUsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkUsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNO1lBQzNCLE1BQU0sSUFBSSxlQUFZLENBQ3BCLHFCQUFxQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQ3JELENBQUM7UUFFSixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLHFCQUFxQixDQUM1QixJQUFpQixFQUFFLEtBQVksRUFBRSxXQUFrQztRQUVuRSxNQUFNLGtCQUFrQixHQUFHLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELE1BQU0sa0JBQWtCLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksa0JBQWtCLENBQUMsTUFBTTtZQUMzQixNQUFNLElBQUksZUFBWSxDQUNwQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUNqRCxDQUFDO1FBRUosT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FDMUIsSUFBaUIsRUFBRSxLQUFZO1FBRS9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0IsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUVoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUk7WUFDekMsQ0FBQyxDQUFDLElBQUksd0JBQVcsQ0FBQyxtQ0FBdUIsQ0FBQztZQUMxQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUk7WUFDN0MsQ0FBQyxDQUFDLElBQUksd0JBQVcsQ0FBQyxtQ0FBdUIsQ0FBQztZQUMxQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGlCQUFpQjtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXZELE9BQU8sQ0FDTCxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQztlQUM5Qyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQzdELENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxpQkFBaUIsQ0FBQyxLQUFtQixFQUFFLEtBQWE7UUFDM0QsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDNUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtLQUM3RSxDQUFDO0lBQ0YsTUFBTSxZQUFZLEdBQ2QsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsT0FBaUIsQ0FBQztJQUNsRSxNQUFNLFVBQVUsR0FDWixJQUFJLE1BQU0sQ0FBQyxLQUFLLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFNUUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFbkMsU0FBUyxlQUFlLENBQUMsSUFBaUI7UUFDeEMsTUFBTSxNQUFNLEdBQWEsRUFBRSxFQUFFLEtBQUssR0FBc0IsRUFBRSxDQUFDO1FBQzNELElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQztvQkFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVoRCxRQUFRLEtBQVIsUUFBUSxHQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUM7YUFDMUQ7aUJBQ0k7Z0JBQ0gsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU07b0JBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELFNBQVMsa0JBQWtCO1FBQ3pCLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQ2xDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FDOUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRW5FLFNBQVMsWUFBWSxDQUFDLElBQWlCO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVMsYUFBYSxDQUFDLElBQWlCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDbkMsQ0FBQztJQUVELFNBQVMsYUFBYSxDQUFDLElBQWlCO1FBQ3RDLE1BQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztRQUU5QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDM0IsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQzlELE1BQU0sVUFBVSxHQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUMxRCxNQUFNLFdBQVcsR0FBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxXQUFXO2dCQUFFLE1BQU07WUFFeEQsSUFBSSxZQUFZO2dCQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxVQUFVO2dCQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELElBQUksV0FBVztnQkFBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMxRDtRQUVELFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQWlCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNsQyxVQUFVLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUNoRSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUM7SUFDakIsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLElBQWlCO1FBQ3BDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRW5DLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ2hDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRO1NBQzNDLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxLQUFLLENBQUMsSUFBaUIsRUFBRSxTQUFrQjtRQUNsRCxNQUFNLEtBQUssR0FBRztZQUNaLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLE1BQU0sRUFBSyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzVCLFFBQVEsRUFBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7WUFDbkMsUUFBUSxFQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDOUIsUUFBUSxFQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7WUFDOUIsT0FBTyxFQUFJLFlBQVksQ0FBQyxJQUFJLENBQUM7U0FDOUIsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJO1lBQ2xELE1BQU0sSUFBSSxlQUFZLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMsWUFBWSxDQUNuQixJQUFpQixFQUFFLEtBQW1CO1FBRXRDLE1BQU0sT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRS9CLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxTQUFTLFdBQVcsQ0FDbEIsSUFBaUIsRUFBRSxLQUFZLEVBQUUsUUFBaUI7UUFFbEQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM5QixNQUFNLFNBQVMsR0FBYSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7WUFDdEUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUU3QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQ2xCLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUN4QjtZQUNFLEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUN0QyxLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFDakIsS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLEVBQ3BCLFNBQVMsRUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFDeEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUNoRCxRQUFRLENBQUMsRUFBRSxDQUNaO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssVUFBVSxlQUFlLENBQzVCLElBQWlCLEVBQUUsS0FBWSxFQUFFLFFBQWlCO1FBRWxELElBQUk7WUFDRixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxRCxDQUFDO1NBQ0g7UUFDRCxPQUFPLFNBQWtCLEVBQUU7WUFDekIsSUFBSSxTQUFTLFlBQVksNEJBQWU7Z0JBQ3RDLElBQUksU0FBUyxDQUFDLElBQUksS0FBSyxHQUFHO29CQUN4QixNQUFNLElBQUksZUFBWSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsSUFBaUIsRUFBRSxLQUFZO1FBQ3JELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDeEIsRUFBRSxLQUFLLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQzlDLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsSUFBaUI7UUFDcEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2pFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFL0IsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELFNBQVMsY0FBYyxDQUFDLFFBQWlCO1FBQ3ZDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2FBQzNCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssVUFBVSxPQUFPLENBQ3BCLElBQWlCLEVBQUUsU0FBa0I7UUFFckMsSUFBSSxJQUFJLENBQUMsUUFBUTtZQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUk7WUFDRixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO2dCQUFFLE9BQU8sSUFBSSxDQUFDO1lBRW5ELElBQUksQ0FBQyxRQUFRLEtBQWIsSUFBSSxDQUFDLFFBQVEsR0FBSyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7WUFDcEQsTUFBTSxlQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEQsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLEtBQWMsRUFBRTtZQUNyQixJQUFJLEtBQUssWUFBWSxlQUFZO2dCQUFFLE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwRSxNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELFNBQWdCLFVBQVU7UUFDeEIscUJBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUN0QixHQUFHLDBCQUFjLE1BQU0sRUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQ3hELENBQUM7UUFDRixxQkFBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ3RCLEdBQUcsMEJBQWMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDdkQsQ0FBQztJQUNKLENBQUM7SUFQZSxlQUFVLGFBT3pCLENBQUE7QUFDSCxDQUFDLEVBdFNnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUFzU3BCIn0=