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
    function initialize() {
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}poll`, chunk => respond(chunk, false));
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}expoll`, chunk => respond(chunk, true));
    }
    Poll.initialize = initialize;
    async function respond(chunk, exclusive) {
        if (chunk.response)
            clearSelectors(chunk.response);
        if (!chunk.args.length)
            return respondHelp(chunk);
        try {
            const query = parse(chunk, exclusive);
            if (!validatePermissions(chunk, query))
                return null;
            chunk.response ?? (chunk.response = await respondLoading(chunk, query));
            await attachSelectors(chunk, query, chunk.response);
            return respondPoll(chunk, query, chunk.response);
        }
        catch (error) {
            if (error instanceof error_1.default)
                return respondError(chunk, error);
            throw error;
        }
    }
    function clearSelectors(response) {
        response.reactions.removeAll()
            .catch(() => undefined);
    }
    function respondHelp(chunk) {
        const options = { content: '', embed: help_1.Help.getEmbed(chunk.lang) };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function parse(chunk, exclusive) {
        const query = {
            exclusive: exclusive,
            author: parseAuthor(chunk),
            imageURL: parseAttachedImage(chunk),
            mentions: parseMentions(chunk),
            question: parseQuestion(chunk),
            choices: parseChoices(chunk),
        };
        if (query.mentions.length && query.question === null)
            throw new error_1.default('ungivenQuestion', chunk.lang);
        return query;
    }
    function parseAuthor(chunk) {
        const user = chunk.request.author;
        const member = chunk.request.member;
        return {
            iconURL: user.displayAvatarURL(),
            name: member?.displayName ?? user.username,
        };
    }
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    function parseAttachedImage(chunk) {
        return chunk.request.attachments.find(attachment => imageExtensions.includes(path_1.extname(attachment.url)))?.url ?? null;
    }
    function parseMentions(chunk) {
        const mentions = [];
        for (const arg of chunk.args) {
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
        mentions.forEach(() => chunk.args.shift());
        return mentions;
    }
    function parseQuestion(chunk) {
        return chunk.args.shift() ?? null;
    }
    function parseChoices(chunk) {
        const choices = chunk.args.length ? generateChoices(chunk) : generateTwoChoices();
        if (choices.length > constants_1.COMMAND_MAX_CHOICES)
            throw new error_1.default('tooManyOptions', chunk.lang);
        return choices;
    }
    const defaultEmojis = [
        '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲',
        '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
    ];
    const twemojiRegex = require('twemoji-parser/dist/lib/regex.js').default;
    const emojiRegex = new RegExp(`^(${twemojiRegex.toString().slice(1, -2)}|<a?:.+?:\\d+>)$`);
    function generateChoices(chunk) {
        const emojis = [], texts = [];
        let external = false;
        chunk.args.forEach(arg => {
            if (emojiRegex.test(arg)) {
                const length = safePushChoiceEmoji(chunk, emojis, arg);
                if (texts.length < length - 1)
                    safePushChoiceText(chunk, texts, null);
                external || (external = !isLocalGuildEmoji(chunk.request.guild, arg));
            }
            else {
                const length = safePushChoiceText(chunk, texts, arg);
                if (emojis.length < length)
                    safePushChoiceEmoji(chunk, emojis, defaultEmojis[length - 1]);
            }
        });
        return emojis.map((emoji, i) => ({ emoji, text: texts[i], external }));
    }
    function safePushChoiceEmoji(chunk, emojis, newEmoji) {
        if (emojis.includes(newEmoji))
            throw new error_1.default('duplicateEmojis', chunk.lang);
        return emojis.push(newEmoji);
    }
    function safePushChoiceText(chunk, texts, newtext) {
        if (newtext && newtext.length > constants_1.COMMAND_QUESTION_MAX)
            throw new error_1.default('tooLongQuestion', chunk.lang);
        return texts.push(newtext);
    }
    function isLocalGuildEmoji(guild, emoji) {
        const match = emoji.match(/^<a?:.+?:(\d+)>$/);
        return guild && match ? guild.emojis.cache.has(match[1]) : false;
    }
    const twoChoiceEmojis = ['⭕', '❌'];
    function generateTwoChoices() {
        return twoChoiceEmojis.map(emoji => ({ emoji: emoji, text: null, external: false }));
    }
    function validatePermissions(chunk, query) {
        const request = chunk.request;
        const channel = request.channel;
        if (channel.type === 'dm')
            return false;
        const myPermissions = channel.permissionsFor(chunk.botID);
        const authorPermissions = getAuthorPermissionsFor(request);
        if (!myPermissions || !authorPermissions)
            return false;
        validateMyPermissions(chunk, query, myPermissions);
        validateAuthorPermissions(chunk, query, myPermissions, authorPermissions);
        return true;
    }
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
    function getAuthorPermissionsFor(request) {
        if (request.channel.type === 'dm')
            return null;
        if (request.webhookID)
            return new discord_js_1.Permissions(constants_1.POSTULATE_WEBHOOK_PERMISSIONS);
        else
            return request.channel.permissionsFor(request.author);
    }
    function validateMyPermissions(chunk, query, permissions) {
        const requirePermissions = sumRequireMyPermissions(query);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackPermissions', chunk.lang, missingPermissions);
    }
    function sumRequireMyPermissions(query) {
        const permissions = pollPermissions.slice();
        if (query.exclusive)
            permissions.push(...exclusivePermissions);
        if (query.choices.some(choice => choice.external))
            permissions.push(...externalPermissions);
        if (query.imageURL)
            permissions.push(...attachImagePermissions);
        return permissions;
    }
    function validateAuthorPermissions(chunk, query, myPermissions, authorPermissions) {
        const requirePermissions = sumRequireAuthoerPermissions(query, myPermissions);
        const missingPermissions = authorPermissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackYourPermissions', chunk.lang, missingPermissions);
    }
    function sumRequireAuthoerPermissions(query, permissions) {
        return query.mentions.length && permissions.has(mentionPermissions)
            ? mentionPermissions : [];
    }
    function respondLoading(chunk, query) {
        return chunk.request.channel.send(query.mentions.join(' '), {
            embed: locale_1.Locales[chunk.lang].loadings.poll(query.exclusive),
            files: query.imageURL ? [query.imageURL] : [],
        });
    }
    async function attachSelectors(chunk, query, response) {
        try {
            await Promise.all(query.choices.map(choice => response.react(choice.emoji)));
        }
        catch (exception) {
            if (exception instanceof discord_js_1.DiscordAPIError)
                if (exception.httpStatus === 400)
                    throw new error_1.default('unusableEmoji', chunk.lang);
        }
    }
    function respondPoll(chunk, query, response) {
        const choices = query.choices;
        const selectors = choices.some(choice => choice.text !== null)
            ? choices.map(choice => choice.emoji) : [];
        return response.edit(query.mentions.join(' '), {
            embed: locale_1.Locales[chunk.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? path_1.basename(query.imageURL) : null, response.channel.id, response.id)
        });
    }
    function respondError(chunk, error) {
        const options = { embed: error.embed };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
})(Poll = exports.Poll || (exports.Poll = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUF5QztBQUN6QywyQ0FNb0I7QUFFcEIsK0NBS3lCO0FBQ3pCLGdEQUE4QztBQUM5QyxzREFBaUU7QUFDakUsb0RBQW1DO0FBQ25DLGlDQUE4QjtBQUU5QixJQUFpQixJQUFJLENBeVVwQjtBQXpVRCxXQUFpQixJQUFJO0lBYW5CLFNBQWdCLFVBQVU7UUFDeEIscUJBQVMsQ0FBQyxjQUFjLENBQ3RCLEdBQUcsMEJBQWMsTUFBTSxFQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FDMUQsQ0FBQztRQUNGLHFCQUFTLENBQUMsY0FBYyxDQUN0QixHQUFHLDBCQUFjLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQ3pELENBQUM7SUFDSixDQUFDO0lBUGUsZUFBVSxhQU96QixDQUFBO0lBRUQsS0FBSyxVQUFVLE9BQU8sQ0FDcEIsS0FBbUIsRUFBRSxTQUFrQjtRQUV2QyxJQUFJLEtBQUssQ0FBQyxRQUFRO1lBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEQsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFcEQsS0FBSyxDQUFDLFFBQVEsS0FBZCxLQUFLLENBQUMsUUFBUSxHQUFLLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBQztZQUN0RCxNQUFNLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRCxPQUFPLFdBQVcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsRDtRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLGVBQVk7Z0JBQUUsT0FBTyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsUUFBaUI7UUFDdkMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7YUFDM0IsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFtQjtRQUN0QyxNQUFNLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbEUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUVoQyxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsU0FBUyxLQUFLLENBQUMsS0FBbUIsRUFBRSxTQUFrQjtRQUNwRCxNQUFNLEtBQUssR0FBRztZQUNaLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLE1BQU0sRUFBSyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzdCLFFBQVEsRUFBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUM7WUFDcEMsUUFBUSxFQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDL0IsUUFBUSxFQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7WUFDL0IsT0FBTyxFQUFJLFlBQVksQ0FBQyxLQUFLLENBQUM7U0FDL0IsQ0FBQztRQUVGLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJO1lBQ2xELE1BQU0sSUFBSSxlQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLEtBQW1CO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRXBDLE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ2hDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRO1NBQzNDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFbkUsU0FBUyxrQkFBa0IsQ0FBQyxLQUFtQjtRQUM3QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDbkMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDaEUsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxTQUFTLGFBQWEsQ0FBQyxLQUFtQjtRQUN4QyxNQUFNLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFFOUIsS0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQzVCLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUM5RCxNQUFNLFVBQVUsR0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDMUQsTUFBTSxXQUFXLEdBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsV0FBVztnQkFBRSxNQUFNO1lBRXhELElBQUksWUFBWTtnQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksVUFBVTtnQkFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNyRCxJQUFJLFdBQVc7Z0JBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUQ7UUFFRCxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUUzQyxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsU0FBUyxhQUFhLENBQUMsS0FBbUI7UUFDeEMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQsU0FBUyxZQUFZLENBQUMsS0FBbUI7UUFDdkMsTUFBTSxPQUFPLEdBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUV0RSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsK0JBQW1CO1lBQ3RDLE1BQU0sSUFBSSxlQUFZLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRztRQUNwQixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO1FBQzVFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7S0FDN0UsQ0FBQztJQUNGLE1BQU0sWUFBWSxHQUNkLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLE9BQWlCLENBQUM7SUFDbEUsTUFBTSxVQUFVLEdBQ1osSUFBSSxNQUFNLENBQUMsS0FBSyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTVFLFNBQVMsZUFBZSxDQUFDLEtBQW1CO1FBQzFDLE1BQU0sTUFBTSxHQUFhLEVBQUUsRUFBRSxLQUFLLEdBQXNCLEVBQUUsQ0FBQztRQUMzRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFckIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUM7b0JBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFFdEUsUUFBUSxLQUFSLFFBQVEsR0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFDO2FBQzNEO2lCQUNJO2dCQUNILE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JELElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNO29CQUN4QixtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqRTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FDMUIsS0FBbUIsRUFBRSxNQUFnQixFQUFFLFFBQWdCO1FBRXZELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDM0IsTUFBTSxJQUFJLGVBQVksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxTQUFTLGtCQUFrQixDQUN6QixLQUFtQixFQUFFLEtBQXdCLEVBQUUsT0FBc0I7UUFFckUsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxnQ0FBb0I7WUFDbEQsTUFBTSxJQUFJLGVBQVksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQW1CLEVBQUUsS0FBYTtRQUMzRCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUMsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNuRSxDQUFDO0lBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFbkMsU0FBUyxrQkFBa0I7UUFDekIsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FDbEMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUM5QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FDMUIsS0FBbUIsRUFBRSxLQUFZO1FBRWpDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDOUIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXhDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELE1BQU0saUJBQWlCLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGlCQUFpQjtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXZELHFCQUFxQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbkQseUJBQXlCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUUxRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLGVBQWUsR0FBZ0M7UUFDbkQsZUFBZSxFQUFFLHNCQUFzQjtLQUN4QyxDQUFDO0lBQ0YsTUFBTSxvQkFBb0IsR0FBZ0M7UUFDeEQsaUJBQWlCO0tBQ2xCLENBQUM7SUFDRixNQUFNLG1CQUFtQixHQUFnQztRQUN2RCxxQkFBcUI7S0FDdEIsQ0FBQztJQUNGLE1BQU0sa0JBQWtCLEdBQWdDO1FBQ3RELGtCQUFrQjtLQUNuQixDQUFDO0lBQ0YsTUFBTSxzQkFBc0IsR0FBZ0M7UUFDMUQsY0FBYztLQUNmLENBQUM7SUFFRixTQUFTLHVCQUF1QixDQUM5QixPQUFnQjtRQUVoQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUvQyxJQUFJLE9BQU8sQ0FBQyxTQUFTO1lBQ25CLE9BQU8sSUFBSSx3QkFBVyxDQUFDLHlDQUE2QixDQUFDLENBQUM7O1lBRXRELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxTQUFTLHFCQUFxQixDQUM1QixLQUFtQixFQUFFLEtBQVksRUFBRSxXQUFrQztRQUVyRSxNQUFNLGtCQUFrQixHQUFHLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELE1BQU0sa0JBQWtCLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25FLElBQUksa0JBQWtCLENBQUMsTUFBTTtZQUMzQixNQUFNLElBQUksZUFBWSxDQUNwQixpQkFBaUIsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUNsRCxDQUFDO0lBQ04sQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBWTtRQUMzQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFNUMsSUFBSSxLQUFLLENBQUMsU0FBUztZQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxDQUFDLFFBQVE7WUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztRQUVoRSxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsU0FBUyx5QkFBeUIsQ0FDaEMsS0FBbUIsRUFBRSxLQUFZLEVBQ2pDLGFBQW9DLEVBQ3BDLGlCQUF3QztRQUV4QyxNQUFNLGtCQUFrQixHQUNwQiw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkQsTUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6RSxJQUFJLGtCQUFrQixDQUFDLE1BQU07WUFDM0IsTUFBTSxJQUFJLGVBQVksQ0FDcEIscUJBQXFCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FDdEQsQ0FBQztJQUNOLENBQUM7SUFFRCxTQUFTLDRCQUE0QixDQUNuQyxLQUFZLEVBQUUsV0FBa0M7UUFFaEQsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO1lBQ2pFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFtQixFQUFFLEtBQVk7UUFDdkQsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQy9CLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUN4QjtZQUNFLEtBQUssRUFBRSxnQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDekQsS0FBSyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1NBQzlDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLFVBQVUsZUFBZSxDQUM1QixLQUFtQixFQUFFLEtBQVksRUFBRSxRQUFpQjtRQUVwRCxJQUFJO1lBQ0YsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDMUQsQ0FBQztTQUNIO1FBQ0QsT0FBTyxTQUFrQixFQUFFO1lBQ3pCLElBQUksU0FBUyxZQUFZLDRCQUFlO2dCQUN0QyxJQUFJLFNBQVMsQ0FBQyxVQUFVLEtBQUssR0FBRztvQkFDOUIsTUFBTSxJQUFJLGVBQVksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUNsQixLQUFtQixFQUFFLEtBQVksRUFBRSxRQUFpQjtRQUVwRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sU0FBUyxHQUFhLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztZQUN0RSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTdDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FDbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQ3hCO1lBQ0UsS0FBSyxFQUFFLGdCQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ3ZDLEtBQUssQ0FBQyxTQUFTLEVBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUNqQixLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFDcEIsU0FBUyxFQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUN4QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQ2hELFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNuQixRQUFRLENBQUMsRUFBRSxDQUNaO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsWUFBWSxDQUNuQixLQUFtQixFQUFFLEtBQW1CO1FBRXhDLE1BQU0sT0FBTyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBRWhDLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7QUFDSCxDQUFDLEVBelVnQixJQUFJLEdBQUosWUFBSSxLQUFKLFlBQUksUUF5VXBCIn0=