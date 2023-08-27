"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const counter_1 = require("../../transactions/counter");
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
const error_1 = __importDefault(require("./error"));
const help_1 = require("./help");
var Result;
(function (Result) {
    function initialize() {
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}sumpoll`, chunk => respond(chunk, false));
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}endpoll`, chunk => respond(chunk, true));
    }
    Result.initialize = initialize;
    async function respond(chunk, isEnd) {
        if (!chunk.args.length)
            return respondHelp(chunk);
        try {
            if (!validate(chunk, isEnd))
                return null;
            counter_1.Counter.count(isEnd ? 'endpoll' : 'sumpoll');
            const query = await parse(chunk, isEnd);
            if (query.isEnd)
                endPoll(chunk, query.poll);
            return respondResult(chunk, query);
        }
        catch (error) {
            if (error instanceof error_1.default)
                return respondError(chunk, error);
            throw error;
        }
    }
    function respondHelp(chunk) {
        const options = { embeds: [help_1.Help.getEmbed(chunk.lang)] };
        const channel = chunk.request.channel;
        const response = chunk.response;
        counter_1.Counter.count('help');
        return response ? response.edit(options) : channel.send(options);
    }
    function respondError(chunk, error) {
        const options = { embeds: [error.embed] };
        const channel = chunk.request.channel;
        const response = chunk.response;
        return response ? response.edit(options) : channel.send(options);
    }
    function validate(chunk, isEnd) {
        const channel = chunk.request.channel;
        if (channel.type === discord_js_1.ChannelType.DM)
            return false;
        if (!isEnd)
            return true;
        const permissions = channel.permissionsFor(chunk.botID);
        if (!permissions)
            return false;
        const missings = permissions.missing('ManageMessages');
        if (missings.length)
            throw new error_1.default('lackPermissions', chunk.lang, missings);
        return true;
    }
    async function parse(chunk, isEnd) {
        const [channelID, messageID] = parseIDs(chunk);
        if (!messageID)
            throw new error_1.default('ungivenMessageID', chunk.lang);
        const channel = getChannel(chunk.request, channelID);
        if (!channel)
            throw new error_1.default('notFoundChannel', chunk.lang);
        let poll;
        try {
            poll = await channel.messages.fetch(messageID);
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError)
                if (error.status === 404)
                    throw new error_1.default('notFoundPoll', chunk.lang);
            throw error;
        }
        if (!isPoll(chunk, poll))
            throw new error_1.default('notFoundPoll', chunk.lang);
        return {
            poll: poll,
            isEnd: isEnd,
            author: parseAuthor(chunk, poll),
            imageURL: parseImage(poll),
            mentions: parseMentions(poll),
            question: parseQuestion(chunk, poll),
            choices: await parseChoices(poll),
        };
    }
    function parseIDs(chunk) {
        const match = chunk.args[0].match(/^((\d+)-)?(\d+)$/);
        if (!match)
            return [null, null];
        return [match[2], match[3]];
    }
    function getChannel(request, channelID) {
        if (request.channel.type === discord_js_1.ChannelType.DM)
            return null;
        if (!channelID)
            return request.channel;
        const channel = request.guild?.channels.cache.get(channelID);
        if (channel?.isTextBased())
            return channel;
        else
            return null;
    }
    function isPoll(chunk, poll) {
        const embed = poll.embeds[0];
        return !!(poll.author.id === chunk.botID
            && embed?.color
            && [constants_1.COLORS.POLL, constants_1.COLORS.EXPOLL].includes(embed.color));
    }
    function parseAuthor(chunk, poll) {
        const author = poll.embeds[0].author;
        if (!author?.iconURL || !author?.name)
            throw new error_1.default('missingFormatPoll', chunk.lang);
        return { iconURL: author.iconURL, name: author.name };
    }
    function parseImage(poll) {
        const attachment = poll.attachments.first();
        return attachment ? attachment.url : null;
    }
    function parseMentions(poll) {
        return poll.content.split(' ');
    }
    function parseQuestion(chunk, poll) {
        const question = poll.embeds[0].title;
        if (!question)
            throw new error_1.default('missingFormatPoll', chunk.lang);
        return question;
    }
    async function parseChoices(poll) {
        const reactions = await Promise.all(poll.reactions.cache.map(reaction => reaction.fetch()));
        const emojis = reactions.map(({ emoji }) => emoji.toString());
        const counts = reactions.map(({ count, me }) => count ? count - Number(me) : 0);
        const total = counts.reduce((total, count) => total + count, 0);
        const rates = counts.map(count => count / (total || 1));
        const description = poll.embeds[0].description;
        const texts = new Map([...(description?.matchAll(/\u200B(.+?) (.*?)\u200C/gs) ?? [])]
            .map(match => [match[1], match[2]]));
        return emojis.map((emoji, i) => ({
            emoji: emoji,
            text: texts.get(emoji) ?? null,
            count: counts[i],
            rate: rates[i],
        }));
    }
    function endPoll(chunk, poll) {
        poll.reactions.removeAll()
            .catch(console.error);
        const embed = new discord_js_1.EmbedBuilder(poll.embeds[0].toJSON());
        const template = locale_1.Locales[chunk.lang].successes.endpoll();
        if (template.color)
            embed.setColor(template.color);
        if (template.footer?.text)
            embed.setFooter({ text: template.footer.text });
        poll.edit({ embeds: [embed] })
            .catch(console.error);
    }
    function respondResult(chunk, query) {
        const choices = query.choices;
        const maxRate = choices.reduce((max, { rate }) => max < rate ? rate : max, 0);
        const graphs = choices.map(({ rate }) => '\\|'.repeat(rate * (100 / maxRate / 1.5)));
        const emojis = choices.map(({ emoji }) => emoji);
        const texts = choices.map(({ text }) => text ?? '');
        const counts = choices.map(({ count }) => count);
        const tops = choices.map(({ rate }) => !!rate && rate === maxRate);
        const rates = choices.map(({ rate }) => (rate * 100).toFixed(1));
        const options = {
            content: query.mentions.join(' ') || undefined,
            embeds: [locale_1.Locales[chunk.lang].successes.graphpoll(query.poll.url, query.author.iconURL, query.author.name, query.question, emojis, texts, counts, tops, rates, graphs)]
        };
        return chunk.response
            ? chunk.response.edit(options)
            : chunk.request.channel.send(options);
    }
})(Result || (exports.Result = Result = {}));
