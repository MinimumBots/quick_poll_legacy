"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
var Judge;
(function (Judge) {
    function initialize(bot) {
        bot.on('messageReactionAdd', (vote, user) => manipulate(vote, user, bot.user.id));
        setInterval(() => sweepKnownUsers(bot), constants_1.MESSAGE_SWEEP_INTERVAL);
    }
    Judge.initialize = initialize;
    function manipulate(vote, user, botID) {
        parse(vote, user, botID)
            .then(ejectVotes => Promise.all(ejectVotes.map(({ users }) => users.remove(user.id))).catch(() => undefined))
            .catch(console.error);
    }
    async function parse(vote, user, botID) {
        if (user.bot)
            return [];
        const poll = await utils_1.Utils.fetchMessage(vote.message);
        if (!poll)
            return [];
        const embed = poll.embeds[0];
        if (poll.author.id !== botID || !embed) {
            utils_1.Utils.removeMessageCache(poll);
            return [];
        }
        user = await user.fetch();
        if (embed.color === constants_1.COLORS.POLL)
            return parsePoll(poll, vote);
        if (embed.color === constants_1.COLORS.EXPOLL)
            return parseExpoll(poll, vote, user);
        if (embed.color === constants_1.COLORS.ENDED)
            return [vote];
        utils_1.Utils.removeMessageCache(poll);
        return [];
    }
    function parsePoll(poll, vote) {
        const myReactions = poll.reactions.cache.filter(({ me }) => me);
        if (!myReactions.size)
            return [];
        const emoji = vote.emoji;
        return myReactions.has(emoji.id ?? emoji.name ?? '') ? [] : [vote];
    }
    function parseExpoll(poll, vote, user) {
        const ejectVotes = parsePoll(poll, vote);
        const known = isKnownUser(poll.channel, poll, user);
        if (ejectVotes.length && known)
            return ejectVotes;
        poll.reactions.cache.get(vote.emoji.id ?? vote.emoji.name ?? '')?.users.cache.set(user.id, user);
        ejectVotes.push(...poll.reactions.cache.filter(({ users, emoji }) => (!known || users.cache.has(user.id)) && !(emoji.name && emoji.name === vote.emoji.name
            && emoji.id === vote.emoji.id)).values());
        rememberUser(poll.channel, poll, user);
        return ejectVotes;
    }
    const knownUserIDs = new Map;
    function rememberUser(channel, message, user) {
        const messageIDs = knownUserIDs.get(channel.id);
        const userIDs = messageIDs?.get(message.id);
        if (userIDs)
            userIDs.add(user.id);
        else {
            if (messageIDs)
                messageIDs.set(message.id, new Set(user.id));
            else
                knownUserIDs.set(channel.id, new discord_js_1.Collection([[message.id, new Set(user.id)]]));
        }
    }
    function isKnownUser(channel, message, user) {
        const userIDs = knownUserIDs.get(channel.id)?.get(message.id);
        return !!userIDs && userIDs.has(user.id);
    }
    function sweepKnownUsers(bot) {
        const channels = bot.channels.cache;
        knownUserIDs.forEach((messageIDs, channelID) => {
            const channel = channels.get(channelID);
            if (!(channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel))
                return;
            messageIDs.sweep((_, id) => !channel.messages.cache.has(id));
        });
    }
})(Judge = exports.Judge || (exports.Judge = {}));
