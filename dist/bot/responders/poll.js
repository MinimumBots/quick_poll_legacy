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
        if (request.channel.type === 'DM')
            return null;
        if (request.webhookId)
            return new discord_js_1.Permissions(constants_1.POSTULATE_WEBHOOK_PERMISSIONS);
        else
            return request.channel.permissionsFor(request.author);
    }
    function validatePermissions(chunk, query) {
        const request = chunk.request;
        const channel = request.channel;
        if (channel.type === 'DM')
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
        return chunk.request.attachments.find(attachment => imageExtensions.includes((0, path_1.extname)(attachment.url)))?.url ?? null;
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
        const options = { embeds: [error.embed] };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function respondPoll(chunk, query, response) {
        const choices = query.choices;
        const selectors = choices.some(choice => choice.text !== null)
            ? choices.map(choice => choice.emoji) : [];
        return response.edit({
            content: query.mentions.join(' ') || null,
            embeds: [locale_1.Locales[chunk.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? (0, path_1.basename)(query.imageURL) : null, response.channel.id, response.id)]
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
        return chunk.request.channel.send({
            content: query.mentions.join(' ') || null,
            embeds: [locale_1.Locales[chunk.lang].loadings.poll(query.exclusive)],
            files: query.imageURL ? [query.imageURL] : [],
        });
    }
    function respondHelp(chunk) {
        const options = { content: null, embed: help_1.Help.getEmbed(chunk.lang) };
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