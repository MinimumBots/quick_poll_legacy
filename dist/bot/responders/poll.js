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
    function validateMyPermissions(chunk, query, permissions) {
        const requirePermissions = sumRequireMyPermissions(query);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackPermissions', chunk.lang, missingPermissions);
    }
    function getAuthorPermissionsFor(request) {
        if (request.channel.type === 'dm')
            return null;
        if (request.webhookID)
            return new discord_js_1.Permissions(constants_1.POSTULATE_WEBHOOK_PERMISSIONS);
        else
            return request.channel.permissionsFor(request.author);
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
    const twoChoiceEmojis = ['⭕', '❌'];
    function generateTwoChoices() {
        return twoChoiceEmojis.map(emoji => ({ emoji: emoji, text: null, external: false }));
    }
    function parseChoices(chunk) {
        const choices = chunk.args.length ? generateChoices(chunk) : generateTwoChoices();
        if (choices.length > constants_1.COMMAND_MAX_CHOICES)
            throw new error_1.default('tooManyOptions', chunk.lang);
        return choices;
    }
    function parseQuestion(chunk) {
        return chunk.args.shift() ?? null;
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
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    function parseAttachedImage(chunk) {
        return chunk.request.attachments.find(attachment => imageExtensions.includes(path_1.extname(attachment.url)))?.url ?? null;
    }
    function parseAuthor(chunk) {
        const user = chunk.request.author;
        const member = chunk.request.member;
        return {
            iconURL: user.displayAvatarURL(),
            name: member?.displayName ?? user.username,
        };
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
    function respondError(chunk, error) {
        const options = { embed: error.embed };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function respondPoll(chunk, query, response) {
        const choices = query.choices;
        const selectors = choices.some(choice => choice.text !== null)
            ? choices.map(choice => choice.emoji) : [];
        return response.edit(query.mentions.join(' '), {
            embed: locale_1.Locales[chunk.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? path_1.basename(query.imageURL) : null, response.channel.id, response.id)
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
    function respondLoading(chunk, query) {
        return chunk.request.channel.send(query.mentions.join(' '), {
            embed: locale_1.Locales[chunk.lang].loadings.poll(query.exclusive),
            files: query.imageURL ? [query.imageURL] : [],
        });
    }
    function respondHelp(chunk) {
        const options = { content: '', embed: help_1.Help.getEmbed(chunk.lang) };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function clearSelectors(response) {
        response.reactions.removeAll()
            .catch(() => undefined);
    }
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
    function initialize() {
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}poll`, chunk => respond(chunk, false));
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}expoll`, chunk => respond(chunk, true));
    }
    Poll.initialize = initialize;
})(Poll = exports.Poll || (exports.Poll = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUF5QztBQUN6QywyQ0FNb0I7QUFFcEIsK0NBS3lCO0FBQ3pCLGdEQUE4QztBQUM5QyxzREFBaUU7QUFDakUsb0RBQW1DO0FBQ25DLGlDQUE4QjtBQUU5QixJQUFpQixJQUFJLENBeVVwQjtBQXpVRCxXQUFpQixJQUFJO0lBYW5CLE1BQU0sZUFBZSxHQUFnQztRQUNuRCxlQUFlLEVBQUUsc0JBQXNCO0tBQ3hDLENBQUM7SUFDRixNQUFNLG9CQUFvQixHQUFnQztRQUN4RCxpQkFBaUI7S0FDbEIsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQWdDO1FBQ3ZELHFCQUFxQjtLQUN0QixDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBZ0M7UUFDdEQsa0JBQWtCO0tBQ25CLENBQUM7SUFDRixNQUFNLHNCQUFzQixHQUFnQztRQUMxRCxjQUFjO0tBQ2YsQ0FBQztJQUVGLFNBQVMsNEJBQTRCLENBQ25DLEtBQVksRUFBRSxXQUFrQztRQUVoRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7WUFDakUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBWTtRQUMzQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFNUMsSUFBSSxLQUFLLENBQUMsU0FBUztZQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9D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