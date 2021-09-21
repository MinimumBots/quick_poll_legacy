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
        if (channel.type === 'DM')
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
        if (request.channel.type === 'DM')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2JvdC9yZXNwb25kZXJzL2V4cG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyQ0FVb0I7QUFFcEIsK0NBQXlFO0FBQ3pFLHNEQUFpRTtBQUNqRSxvREFBbUM7QUFDbkMsaUNBQThCO0FBRTlCLElBQWlCLE1BQU0sQ0F5TXRCO0FBek1ELFdBQWlCLE1BQU07SUFDckIsU0FBZ0IsVUFBVTtRQUN4QixxQkFBUyxDQUFDLGNBQWMsQ0FDdEIsR0FBRywwQkFBYyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQ3BELENBQUM7SUFDSixDQUFDO0lBSmUsaUJBQVUsYUFJekIsQ0FBQTtJQWdCRCxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQW1CO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJO1lBQ0YsSUFBSSxLQUFLLENBQUMsUUFBUTtnQkFDaEIsTUFBTSxJQUFJLGVBQVksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLG1CQUFtQjtnQkFBRSxPQUFPLElBQUksQ0FBQztZQUV0QyxNQUFNLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsT0FBTyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN0QztRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLGVBQVk7Z0JBQUUsT0FBTyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFtQjtRQUM5QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssSUFBSTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXhDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxXQUFXO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFL0IsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVyRCxJQUFJLFFBQVEsQ0FBQyxNQUFNO1lBQ2pCLE1BQU0sSUFBSSxlQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFtQjtRQUN0QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFdBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxTQUFTLFlBQVksQ0FDbkIsS0FBbUIsRUFBRSxLQUFtQjtRQUV4QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELEtBQUssVUFBVSxLQUFLLENBQUMsS0FBbUI7UUFDdEMsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVM7WUFBRSxNQUFNLElBQUksZUFBWSxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2RSxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTztZQUFFLE1BQU0sSUFBSSxlQUFZLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBFLElBQUksSUFBYSxDQUFDO1FBRWxCLElBQUk7WUFDRixJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoRDtRQUNELE9BQU8sS0FBYyxFQUFFO1lBQ3JCLElBQUksS0FBSyxZQUFZLDRCQUFlO2dCQUNsQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssR0FBRztvQkFDMUIsTUFBTSxJQUFJLGVBQVksQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZELE1BQU0sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7WUFDdEIsTUFBTSxJQUFJLGVBQVksQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJELE1BQU0sT0FBTyxHQUFHLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSTtZQUNWLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FDOUIsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLFFBQVEsQ0FBQyxLQUFtQjtRQUNuQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxTQUFTLFVBQVUsQ0FDakIsT0FBZ0IsRUFBRSxTQUEyQjtRQUU3QyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUk7WUFBRSxPQUFPLElBQUksQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUV2QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdELElBQUksT0FBTyxZQUFZLHdCQUFXLElBQUksT0FBTyxZQUFZLHdCQUFXO1lBQ2xFLE9BQU8sT0FBTyxDQUFDOztZQUVmLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTLE1BQU0sQ0FBQyxLQUFtQixFQUFFLElBQWE7UUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QixPQUFPLENBQUMsQ0FBQyxDQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxLQUFLO2VBQzNCLEtBQUssRUFBRSxLQUFLO2VBQ1osQ0FBQyxrQkFBTSxDQUFDLElBQUksRUFBRSxrQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQ3RELENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxVQUFVLFlBQVksQ0FBQyxJQUFhO1FBQ3ZDLE1BQU0sU0FBUyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQ3ZELENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FDMUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ2xELENBQUM7UUFDRixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQ25CLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQzVDLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUM5QjtZQUNFLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSTtZQUN6QyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNmLENBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssVUFBVSxVQUFVLENBQUMsSUFBYTtRQUNyQyxNQUFNLEtBQUssR0FBVSxJQUFJLHVCQUFVLENBQUM7UUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDdkMsTUFBTSxjQUFjLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUN0QyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQzVDLENBQUM7UUFFRixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLElBQUksSUFBSSxDQUFDLEdBQUc7b0JBQUUsT0FBTztnQkFFckIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU4sSUFBSSxDQUFDLENBQUMsSUFBTSxLQUFLLENBQUEsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsU0FBUyxXQUFXLENBQUMsS0FBWTtRQUMvQixJQUFJLEdBQUcsR0FBRyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3pELElBQUksS0FBSyxZQUFZLDBCQUFhO2dCQUNoQyxPQUFPLElBQUksS0FBSyxHQUFHLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO1lBQ3hELElBQUksS0FBSyxZQUFZLHVCQUFVO2dCQUM3QixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVwQixHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUNyQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FDN0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFckIsR0FBRyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDNUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzlELENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVuQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsU0FBUyxVQUFVLENBQ2pCLEtBQW1CLEVBQUUsS0FBWSxFQUFFLEdBQVc7UUFFOUMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQy9CLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQy9ELENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxFQXpNZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBeU10QiJ9