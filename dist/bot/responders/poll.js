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
    }
    function validateMyPermissions(data, query, permissions) {
        const requirePermissions = sumRequireMyPermissions(query);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackPermissions', data.lang, missingPermissions);
    }
    function validatePermissions(data, query) {
        const request = data.request;
        const channel = request.channel;
        if (channel.type === 'dm')
            return false;
        const myPermissions = channel.permissionsFor(data.botID);
        const authorPermissions = channel.permissionsFor(request.author);
        if (!myPermissions || !authorPermissions)
            return false;
        validateMyPermissions(data, query, myPermissions);
        validateAuthorPermissions(data, query, authorPermissions);
        return true;
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
    function safePushChoiceEmoji(data, emojis, newEmoji) {
        if (emojis.includes(newEmoji))
            throw new error_1.default('duplicateEmojis', data.lang);
        return emojis.push(newEmoji);
    }
    function safePushChoiceText(data, texts, newtext) {
        if (newtext && newtext.length > constants_1.COMMAND_QUESTION_MAX)
            throw new error_1.default('tooLongQuestion', data.lang);
        return texts.push(newtext);
    }
    function generateChoices(data) {
        const emojis = [], texts = [];
        let external = false;
        data.args.forEach(arg => {
            if (emojiRegex.test(arg)) {
                const length = safePushChoiceEmoji(data, emojis, arg);
                if (texts.length < length - 1)
                    safePushChoiceText(data, texts, null);
                external || (external = !isLocalGuildEmoji(data.request.guild, arg));
            }
            else {
                const length = safePushChoiceText(data, texts, arg);
                if (emojis.length < length)
                    safePushChoiceEmoji(data, emojis, defaultEmojis[length - 1]);
            }
        });
        return emojis.map((emoji, i) => ({ emoji, text: texts[i], external }));
    }
    const twoChoiceEmojis = ['⭕', '❌'];
    function generateTwoChoices() {
        return twoChoiceEmojis.map(emoji => ({ emoji: emoji, text: null, external: false }));
    }
    function parseChoices(data) {
        const choices = data.args.length ? generateChoices(data) : generateTwoChoices();
        if (choices.length > constants_1.COMMAND_MAX_CHOICES)
            throw new error_1.default('tooManyOptions', data.lang);
        return choices;
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
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
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
            embed: locale_1.Locales[data.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? path_1.basename(query.imageURL) : null, response.channel.id, response.id)
        });
    }
    async function attachSelectors(data, query, response) {
        try {
            await Promise.all(query.choices.map(choice => response.react(choice.emoji)));
        }
        catch (exception) {
            if (exception instanceof discord_js_1.DiscordAPIError)
                if (exception.httpStatus === 400)
                    throw new error_1.default('unusableEmoji', data.lang);
        }
    }
    function respondLoading(data, query) {
        return data.request.channel.send(query.mentions.join(' '), {
            embed: locale_1.Locales[data.lang].loadings.poll(query.exclusive),
            files: query.imageURL ? [query.imageURL] : [],
        });
    }
    function respondHelp(data) {
        const options = { content: '', embed: help_1.Help.getEmbed(data.lang) };
        const channel = data.request.channel;
        const response = data.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function clearSelectors(response) {
        response.reactions.removeAll()
            .catch(() => undefined);
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
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}poll`, data => respond(data, false));
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}expoll`, data => respond(data, true));
    }
    Poll.initialize = initialize;
})(Poll = exports.Poll || (exports.Poll = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUF5QztBQUN6QywyQ0FNb0I7QUFFcEIsK0NBSXlCO0FBQ3pCLGdEQUE4QztBQUM5QyxzREFBZ0U7QUFDaEUsb0RBQW1DO0FBQ25DLGlDQUE4QjtBQUU5QixJQUFpQixJQUFJLENBMlRwQjtBQTNURCxXQUFpQixJQUFJO0lBYW5CLE1BQU0sZUFBZSxHQUF1QjtRQUMxQyxlQUFlLEVBQUUsc0JBQXNCO0tBQ3hDLENBQUM7SUFDRixNQUFNLG9CQUFvQixHQUF1QjtRQUMvQyxpQkFBaUI7S0FDbEIsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQXVCO1FBQzlDLHFCQUFxQjtLQUN0QixDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBdUI7UUFDN0Msa0JBQWtCO0tBQ25CLENBQUM7SUFDRixNQUFNLHNCQUFzQixHQUF1QjtRQUNqRCxjQUFjO0tBQ2YsQ0FBQztJQUVGLFNBQVMsNEJBQTRCLENBQ25DLEtBQVksRUFBRSxXQUFrQztRQUVoRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7WUFDakUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBWTtRQUMzQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUM7UUFFcEMsSUFBSSxLQUFLLENBQUMsU0FBUztZQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxDQUFDLFFBQVE7WUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztRQUVoRSxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyx5QkFBeUIsQ0FDaEMsSUFBaUIsRUFBRSxLQUFZLEVBQUUsV0FBa0M7UUFFbkUsTUFBTSxrQkFBa0IsR0FBRyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUUsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkUsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNO1lBQzNCLE1BQU0sSUFBSSxlQUFZLENBQ3BCLHFCQUFxQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQ3JELENBQUM7SUFDTixDQUFDO0lBRUQsU0FBUyxxQkFBcUIsQ0FDNUIsSUFBaUIsRUFBRSxLQUFZLEVBQUUsV0FBa0M7UUFFbkUsTUFBTSxrQkFBa0IsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRCxNQUFNLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuRSxJQUFJLGtCQUFrQixDQUFDLE1BQU07WUFDM0IsTUFBTSxJQUFJLGVBQVksQ0FDcEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FDakQsQ0FBQztJQUNOLENBQUM7SUFFRCxTQUFTLG1CQUFtQixDQUMxQixJQUFpQixFQUFFLEtBQVk7UUFFL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM3QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFeEMsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekQsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsaUJBQWlCO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFdkQscUJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRCx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFMUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxpQkFBaUIsQ0FBQyxLQUFtQixFQUFFLEtBQWE7UUFDM0QsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHO1FBQ3BCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7UUFDNUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtLQUM3RSxDQUFDO0lBQ0YsTUFBTSxZQUFZLEdBQ2QsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsT0FBaUIsQ0FBQztJQUNsRSxNQUFNLFVBQVUsR0FDWixJQUFJLE1BQU0sQ0FBQyxLQUFLLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFNUUsU0FBUyxtQkFBbUIsQ0FDMUIsSUFBaUIsRUFBRSxNQUFnQixFQUFFLFFBQWdCO1FBRXJELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDM0IsTUFBTSxJQUFJLGVBQVksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUN6QixJQUFpQixFQUFFLEtBQXdCLEVBQUUsT0FBc0I7UUFFbkUsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxnQ0FBb0I7WUFDbEQsTUFBTSxJQUFJLGVBQVksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFpQjtRQUN4QyxNQUFNLE1BQU0sR0FBYSxFQUFFLEVBQUUsS0FBSyxHQUFzQixFQUFFLENBQUM7UUFDM0QsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXJCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDO29CQUFFLGtCQUFrQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXJFLFFBQVEsS0FBUixRQUFRLEdBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBQzthQUMxRDtpQkFDSTtnQkFDSCxNQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTTtvQkFDeEIsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRW5DLFNBQVMsa0JBQWtCO1FBQ3pCLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQ2xDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FDOUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsWUFBWSxDQUFDLElBQWlCO1FBQ3JDLE1BQU0sT0FBTyxHQUNULElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFcEUsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLCtCQUFtQjtZQUN0QyxNQUFNLElBQUksZUFBWSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0RCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxhQUFhLENBQUMsSUFBaUI7UUFDdEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQsU0FBUyxhQUFhLENBQUMsSUFBaUI7UUFDdEMsTUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBRTlCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUMzQixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDOUQsTUFBTSxVQUFVLEdBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzFELE1BQU0sV0FBVyxHQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFdBQVc7Z0JBQUUsTUFBTTtZQUV4RCxJQUFJLFlBQVk7Z0JBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxJQUFJLFVBQVU7Z0JBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxXQUFXO2dCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFMUMsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRW5FLFNBQVMsa0JBQWtCLENBQUMsSUFBaUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ2xDLFVBQVUsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQ2hFLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsSUFBaUI7UUFDcEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFbkMsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVE7U0FDM0MsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLEtBQUssQ0FBQyxJQUFpQixFQUFFLFNBQWtCO1FBQ2xELE1BQU0sS0FBSyxHQUFHO1lBQ1osU0FBUyxFQUFFLFNBQVM7WUFDcEIsTUFBTSxFQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDNUIsUUFBUSxFQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQztZQUNuQyxRQUFRLEVBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztZQUM5QixRQUFRLEVBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztZQUM5QixPQUFPLEVBQUksWUFBWSxDQUFDLElBQUksQ0FBQztTQUM5QixDQUFDO1FBRUYsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUk7WUFDbEQsTUFBTSxJQUFJLGVBQVksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsU0FBUyxZQUFZLENBQ25CLElBQWlCLEVBQUUsS0FBbUI7UUFFdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFL0IsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUNsQixJQUFpQixFQUFFLEtBQVksRUFBRSxRQUFpQjtRQUVsRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sU0FBUyxHQUFhLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztZQUN0RSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTdDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FDbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQ3hCO1lBQ0UsS0FBSyxFQUFFLGdCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ3RDLEtBQUssQ0FBQyxTQUFTLEVBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUNqQixLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFDcEIsU0FBUyxFQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUN4QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ2hELFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNuQixRQUFRLENBQUMsRUFBRSxDQUNaO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssVUFBVSxlQUFlLENBQzVCLElBQWlCLEVBQUUsS0FBWSxFQUFFLFFBQWlCO1FBRWxELElBQUk7WUFDRixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxRCxDQUFDO1NBQ0g7UUFDRCxPQUFPLFNBQWtCLEVBQUU7WUFDekIsSUFBSSxTQUFTLFlBQVksNEJBQWU7Z0JBQ3RDLElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxHQUFHO29CQUM5QixNQUFNLElBQUksZUFBWSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsSUFBaUIsRUFBRSxLQUFZO1FBQ3JELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDeEI7WUFDRSxLQUFLLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hELEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUM5QyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsSUFBaUI7UUFDcEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2pFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFL0IsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELFNBQVMsY0FBYyxDQUFDLFFBQWlCO1FBQ3ZDLFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2FBQzNCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSyxVQUFVLE9BQU8sQ0FDcEIsSUFBaUIsRUFBRSxTQUFrQjtRQUVyQyxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFaEQsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFbkQsSUFBSSxDQUFDLFFBQVEsS0FBYixJQUFJLENBQUMsUUFBUSxHQUFLLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBQztZQUNwRCxNQUFNLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLGVBQVk7Z0JBQUUsT0FBTyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsU0FBZ0IsVUFBVTtRQUN4QixxQkFBUyxDQUFDLGNBQWMsQ0FDdEIsR0FBRywwQkFBYyxNQUFNLEVBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUN4RCxDQUFDO1FBQ0YscUJBQVMsQ0FBQyxjQUFjLENBQ3RCLEdBQUcsMEJBQWMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDdkQsQ0FBQztJQUNKLENBQUM7SUFQZSxlQUFVLGFBT3pCLENBQUE7QUFDSCxDQUFDLEVBM1RnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUEyVHBCIn0=