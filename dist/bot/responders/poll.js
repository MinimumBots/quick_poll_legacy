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
        if (query.exclusive && data.request.channel.type === 'dm')
            throw new error_1.default('unavailableExclusive', data.lang);
        const requirePermissions = sumRequireMyPermissions(query);
        const missingPermissions = permissions.missing(requirePermissions);
        if (missingPermissions.length)
            throw new error_1.default('lackPermissions', data.lang, missingPermissions);
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
            embed: locale_1.Locales[data.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? path_1.basename(query.imageURL) : null, response.id)
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
            embed: locale_1.Locales[data.lang].loadings.poll(),
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
        allocater_1.Allocater.responders.set(`${constants_1.COMMAND_PREFIX}poll`, data => respond(data, false));
        allocater_1.Allocater.responders.set(`${constants_1.COMMAND_PREFIX}expoll`, data => respond(data, true));
    }
    Poll.initialize = initialize;
})(Poll = exports.Poll || (exports.Poll = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtCQUF5QztBQUN6QywyQ0FNb0I7QUFFcEIsK0NBQXFIO0FBQ3JILGdEQUE4QztBQUM5QyxzREFBZ0U7QUFDaEUsb0RBQW1DO0FBQ25DLGlDQUE4QjtBQUU5QixJQUFpQixJQUFJLENBZ1VwQjtBQWhVRCxXQUFpQixJQUFJO0lBYW5CLE1BQU0sZUFBZSxHQUF1QjtRQUMxQyxlQUFlLEVBQUUsc0JBQXNCO0tBQ3hDLENBQUM7SUFDRixNQUFNLG9CQUFvQixHQUF1QjtRQUMvQyxpQkFBaUI7S0FDbEIsQ0FBQztJQUNGLE1BQU0sbUJBQW1CLEdBQXVCO1FBQzlDLHFCQUFxQjtLQUN0QixDQUFDO0lBQ0YsTUFBTSxrQkFBa0IsR0FBdUI7UUFDN0Msa0JBQWtCO0tBQ25CLENBQUM7SUFDRixNQUFNLHNCQUFzQixHQUF1QjtRQUNqRCxjQUFjO0tBQ2YsQ0FBQztJQUVGLFNBQVMsNEJBQTRCLENBQ25DLEtBQVksRUFBRSxXQUFrQztRQUVoRCxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7WUFDakUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsS0FBWTtRQUMzQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUM7UUFFcEMsSUFBSSxLQUFLLENBQUMsU0FBUztZQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLFdBQVcsQ0FBQyxJQUFJ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