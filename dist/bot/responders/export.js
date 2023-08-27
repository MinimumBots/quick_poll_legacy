"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const counter_1 = require("../../transactions/counter");
const allocater_1 = require("../allotters/allocater");
const error_1 = __importDefault(require("./error"));
const help_1 = require("./help");
var Export;
(function (Export) {
    function initialize() {
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}csvpoll`, chunk => respond(chunk));
    }
    Export.initialize = initialize;
    async function respond(chunk) {
        if (!chunk.args.length)
            return respondHelp(chunk);
        try {
            if (chunk.response)
                throw new error_1.default('unavailableExport', chunk.lang);
            if (!validatePermissions)
                return null;
            counter_1.Counter.count('csvpoll');
            const query = await parse(chunk);
            const csv = generateCSV(query);
            return respondCSV(chunk, query, csv);
        }
        catch (error) {
            if (error instanceof error_1.default)
                return respondError(chunk, error);
            throw error;
        }
    }
    function validatePermissions(chunk) {
        const channel = chunk.request.channel;
        if (channel.type === discord_js_1.ChannelType.DM)
            return false;
        const permissions = channel.permissionsFor(chunk.botID);
        if (!permissions)
            return false;
        const missings = permissions.missing('AttachFiles');
        if (missings.length)
            throw new error_1.default('lackPermissions', chunk.lang, missings);
        return true;
    }
    function respondHelp(chunk) {
        counter_1.Counter.count('help');
        return chunk.request.channel.send({ embeds: [help_1.Help.getEmbed(chunk.lang)] });
    }
    function respondError(chunk, error) {
        return chunk.request.channel.send({ embeds: [error.embed] });
    }
    async function parse(chunk) {
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
        const choices = await parseChoices(poll);
        return {
            poll: poll,
            choices: choices,
            votes: await parseVotes(poll),
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
    async function parseChoices(poll) {
        const reactions = await Promise.all(poll.reactions.cache.map(reaction => reaction.fetch()));
        const emojis = reactions.map(({ emoji }) => emoji);
        const counts = reactions.map(({ count, me }) => count ? count - Number(me) : 0);
        const total = counts.reduce((total, count) => total + count, 0);
        const rates = counts.map(count => count / (total || 1));
        const description = poll.embeds[0].description;
        const texts = new Map([...(description?.matchAll(/\u200B(.+?) (.+?)\u200C/g) ?? [])]
            .map(([_, emoji, text]) => [emoji, text]));
        return emojis.map((emoji, i) => ({
            emoji: emoji,
            text: texts.get(emoji.toString()) ?? null,
            count: counts[i],
            rate: rates[i],
        }));
    }
    async function parseVotes(poll) {
        const votes = new discord_js_1.Collection;
        const reactions = poll.reactions.cache;
        const reactionsUsers = await Promise.all(reactions.map(({ users }) => users.fetch()));
        reactionsUsers.forEach((users, i) => {
            users.forEach(user => {
                if (user.bot)
                    return;
                const vote = votes.get(user) ?? Array(i).fill(false);
                vote[i] = true;
                votes.set(user, vote);
            });
            votes.forEach(vote => vote[i] ??= false);
        });
        return votes;
    }
    function generateCSV(query) {
        let csv = 'Users,' + query.choices.map(({ emoji, text }) => {
            if (emoji instanceof discord_js_1.ReactionEmoji)
                return `"${emoji}${text?.replace(/"/g, '""') || ''}"`;
            if (emoji instanceof discord_js_1.GuildEmoji)
                return text ? text.replace(/"/g, '""') : emoji.name;
        }).join(',') + '\n';
        csv += query.votes.map((vote, user) => (`${user.tag},${vote.map(flag => flag ? '◯' : '').join(',')}`)).join('\n') + '\n';
        csv += ',' + query.choices.map(({ count, rate }) => `${count} (${(rate * 100).toFixed(1)}%)`).join(',') + '\n';
        return Buffer.from('\uFEFF' + csv, 'utf8');
    }
    function respondCSV(chunk, query, csv) {
        return chunk.request.channel.send({ files: [{ attachment: csv, name: `${query.poll.id}.csv` }] });
    }
})(Export || (exports.Export = Export = {}));
