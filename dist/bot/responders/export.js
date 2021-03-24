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
        if (channel.type === 'dm')
            return false;
        const permissions = channel.permissionsFor(chunk.botID);
        if (!permissions)
            return false;
        const missings = permissions.missing('ATTACH_FILES');
        if (missings.length)
            throw new error_1.default('lackPermissions', chunk.lang, missings);
        return true;
    }
    function respondHelp(chunk) {
        return chunk.request.channel.send({ embed: help_1.Help.getEmbed(chunk.lang) });
    }
    function respondError(chunk, error) {
        return chunk.request.channel.send({ embed: error.embed });
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
                if (error.httpStatus === 404)
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
    function respondCSV(chunk, query, csv) {
        return chunk.request.channel.send({ files: [{ attachment: csv, name: `${query.poll.id}.csv` }] });
    }
})(Export = exports.Export || (exports.Export = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9yZXNwb25kZXJzL2V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FVb0I7QUFFcEIsK0NBQXlFO0FBQ3pFLHNEQUFpRTtBQUNqRSxvREFBbUM7QUFDbkMsaUNBQThCO0FBRTlCLElBQWlCLE1BQU0sQ0F5TXRCO0FBek1ELFdBQWlCLE1BQU07SUFDckIsU0FBZ0IsVUFBVTtRQUN4QixxQkFBUyxDQUFDLGNBQWMsQ0FDdEIsR0FBRywwQkFBYyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQ3BELENBQUM7SUFDSixDQUFDO0lBSmUsaUJBQVUsYUFJekIsQ0FBQTtJQWdCRCxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQW1CO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJO1lBQ0YsSUFBSSxLQUFLLENBQUMsUUFBUTtnQkFDaEIsTUFBTSxJQUFJLGVBQVksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLG1CQUFtQjtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUV0QyxNQUFNLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN0QztRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLGVBQVk7Z0JBQUUsT0FBTyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFtQjtRQUM5QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXhDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxXQUFXO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFL0IsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVyRCxJQUFJLFFBQVEsQ0FBQyxNQUFNO1lBQ2pCLE1BQU0sSUFBSSxlQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFtQjtRQUN0QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELFNBQVMsWUFBWSxDQUNuQixLQUFtQixFQUFFLEtBQW1CO1FBRXhDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxLQUFLLFVBQVUsS0FBSyxDQUFDLEtBQW1CO1FBQ3RDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTO1lBQUUsTUFBTSxJQUFJLGVBQVksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkUsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU87WUFBRSxNQUFNLElBQUksZUFBWSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwRSxJQUFJLElBQWEsQ0FBQztRQUVsQixJQUFJO1lBQ0YsSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLEtBQWMsRUFBRTtZQUNyQixJQUFJLEtBQUssWUFBWSw0QkFBZTtnQkFDbEMsSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLEdBQUc7b0JBQzFCLE1BQU0sSUFBSSxlQUFZLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2RCxNQUFNLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxlQUFZLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyRCxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDO1NBQzlCLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxRQUFRLENBQUMsS0FBbUI7UUFDbkMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsU0FBUyxVQUFVLENBQ2pCLE9BQWdCLEVBQUUsU0FBMkI7UUFFN0MsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFdkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3RCxJQUFJLE9BQU8sWUFBWSx3QkFBVyxJQUFJLE9BQU8sWUFBWSx3QkFBVztZQUNsRSxPQUFPLE9BQU8sQ0FBQzs7WUFFZixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsS0FBbUIsRUFBRSxJQUFhO1FBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0IsT0FBTyxDQUFDLENBQUMsQ0FDUCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsS0FBSztlQUMzQixLQUFLLEVBQUUsS0FBSztlQUNaLENBQUMsa0JBQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUN0RCxDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssVUFBVSxZQUFZLENBQUMsSUFBYTtRQUN2QyxNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUN2RCxDQUFDO1FBQ0YsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQzFCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNsRCxDQUFDO1FBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUNuQixDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDM0QsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUM1QyxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDOUI7WUFDRSxLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLElBQUk7WUFDekMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDZixDQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLFVBQVUsVUFBVSxDQUFDLElBQWE7UUFDckMsTUFBTSxLQUFLLEdBQVUsSUFBSSx1QkFBVSxDQUFDO1FBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLE1BQU0sY0FBYyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDdEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUM1QyxDQUFDO1FBRUYsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixJQUFJLElBQUksQ0FBQyxHQUFHO29CQUFFLE9BQU87Z0JBRXJCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDZixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFOLElBQUksQ0FBQyxDQUFDLElBQU0sS0FBSyxDQUFBLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLEtBQVk7UUFDL0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUN6RCxJQUFJLEtBQUssWUFBWSwwQkFBYTtnQkFDaEMsT0FBTyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztZQUN4RCxJQUFJLEtBQUssWUFBWSx1QkFBVTtnQkFDN0IsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFcEIsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FDckMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQzdELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRXJCLEdBQUcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQzVCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUM5RCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFbkIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELFNBQVMsVUFBVSxDQUNqQixLQUFtQixFQUFFLEtBQVksRUFBRSxHQUFXO1FBRTlDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUMvQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUMvRCxDQUFDO0lBQ0osQ0FBQztBQUNILENBQUMsRUF6TWdCLE1BQU0sR0FBTixjQUFNLEtBQU4sY0FBTSxRQXlNdEIifQ==