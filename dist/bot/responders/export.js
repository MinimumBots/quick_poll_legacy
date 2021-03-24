"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const allocater_1 = require("../allotters/allocater");
const error_1 = __importDefault(require("./error"));
const help_1 = require("./help");
var Export;
(function (Export) {
    function initialize() {
        allocater_1.Allocater.entryResponder(`${constants_1.COMMAND_PREFIX}csvpoll`, data => respond(data));
    }
    Export.initialize = initialize;
    async function respond(data) {
        if (!data.args.length)
            return respondHelp(data);
        try {
            if (data.response)
                throw new error_1.default('unavailableExport', data.lang);
            if (!validatePermissions)
                return null;
            const query = await parse(data);
            const csv = generateCSV(query);
            return respondCSV(data, query, csv);
        }
        catch (error) {
            if (error instanceof error_1.default)
                return respondError(data, error);
            throw error;
        }
    }
    function validatePermissions(data) {
        const channel = data.request.channel;
        if (channel.type === 'dm')
            return false;
        const permissions = channel.permissionsFor(data.botID);
        if (!permissions)
            return false;
        const missings = permissions.missing('ATTACH_FILES');
        if (missings.length)
            throw new error_1.default('lackPermissions', data.lang, missings);
        return true;
    }
    function respondHelp(data) {
        return data.request.channel.send({ embed: help_1.Help.getEmbed(data.lang) });
    }
    function respondError(data, error) {
        return data.request.channel.send({ embed: error.embed });
    }
    async function parse(data) {
        const [channelID, messageID] = parseIDs(data);
        if (!messageID)
            throw new error_1.default('ungivenMessageID', data.lang);
        const channel = getChannel(data.request, channelID);
        if (!channel)
            throw new error_1.default('notFoundChannel', data.lang);
        let poll;
        try {
            poll = await channel.messages.fetch(messageID);
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError)
                if (error.httpStatus === 404)
                    throw new error_1.default('notFoundPoll', data.lang);
            throw error;
        }
        if (!isPoll(data, poll))
            throw new error_1.default('notFoundPoll', data.lang);
        const choices = await parseChoices(poll);
        return {
            poll: poll,
            choices: choices,
            votes: await parseVotes(poll),
        };
    }
    function parseIDs(data) {
        const match = data.args[0].match(/^((\d+)-)?(\d+)$/);
        if (!match)
            return [null, null];
        return [match[2], match[3]];
    }
    function getChannel(request, channelID) {
        if (request.channel.type === 'dm')
            return null;
        if (!channelID)
            return request.channel;
        const channel = request.guild?.channels.cache.get(channelID);
        if (channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel)
            return channel;
        else
            return null;
    }
    function isPoll(data, poll) {
        const embed = poll.embeds[0];
        return !!(poll.author.id === data.botID
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
            votes.forEach(vote => vote[i] ?? (vote[i] = false));
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
    function respondCSV(data, query, csv) {
        return data.request.channel.send({ files: [{ attachment: csv, name: `${query.poll.id}.csv` }] });
    }
})(Export = exports.Export || (exports.Export = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9yZXNwb25kZXJzL2V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FVb0I7QUFFcEIsK0NBQXlFO0FBQ3pFLHNEQUFnRTtBQUNoRSxvREFBbUM7QUFDbkMsaUNBQThCO0FBRTlCLElBQWlCLE1BQU0sQ0FxTXRCO0FBck1ELFdBQWlCLE1BQU07SUFDckIsU0FBZ0IsVUFBVTtRQUN4QixxQkFBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLDBCQUFjLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFGZSxpQkFBVSxhQUV6QixDQUFBO0lBZ0JELEtBQUssVUFBVSxPQUFPLENBQUMsSUFBaUI7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELElBQUk7WUFDRixJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUFFLE1BQU0sSUFBSSxlQUFZLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxtQkFBbUI7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFdEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLEtBQWMsRUFBRTtZQUNyQixJQUFJLEtBQUssWUFBWSxlQUFZO2dCQUFFLE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwRSxNQUFNLEtBQUss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