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
            embeds: [locale_1.Locales[chunk.lang].successes.poll(query.exclusive, query.author.iconURL, query.author.name, query.question ?? '', selectors, choices.map(choice => choice.text ?? ''), query.imageURL ? (0, path_1.basename)(query.imageURL) : null, response.channelId, response.id)]
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
        const options = { embeds: [help_1.Help.getEmbed(chunk.lang)] };
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
