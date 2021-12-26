"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge = void 0;
const VoteTracer_1 = require("./VoteTracer");
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
;
var Judge;
(function (Judge) {
    const tracer = new VoteTracer_1.VoteTracer();
    function adjustCache(message) {
        tracer.deleteMessage(message);
        return false;
    }
    Judge.adjustCache = adjustCache;
    function initialize(bot) {
        bot
            .on('messageReactionAdd', (reaction, user) => {
            regulateAddVote(bot, reaction, user)
                .catch(console.error);
        })
            .on('messageReactionRemove', (reaction, user) => {
            regulateRemoveVote(bot, reaction, user)
                .catch(console.error);
        })
            .on('messageReactionRemoveEmoji', reaction => {
            tracer.clearEmoji(reaction.message, VoteTracer_1.VoteTracer.toEmojiId(reaction.emoji));
        })
            .on('messageReactionRemoveAll', message => {
            tracer.deleteMessage(message);
        })
            .on('messageDelete', message => {
            tracer.deleteMessage(message);
        })
            .on('channelDelete', channel => {
            tracer.deleteChannel(channel);
        })
            .on('guildDelete', guild => {
            guild.channels.cache.each(channel => tracer.deleteChannel(channel));
        });
    }
    Judge.initialize = initialize;
    async function regulateAddVote(bot, reaction, user) {
        if (user.id === bot.user.id)
            return;
        const message = await reaction.message.fetch(false);
        if (!isPollMessage(bot, message)) {
            utils_1.Utils.removeMessageCache(message);
            return;
        }
        if (isEndPoll(message)) {
            await message.reactions.removeAll();
            return;
        }
        const reactionEmojiId = VoteTracer_1.VoteTracer.toEmojiId(reaction.emoji);
        const refreshedReaction = message.reactions.cache.get(reactionEmojiId);
        if (!refreshedReaction)
            return;
        reaction = refreshedReaction;
        if (!isFreePoll(message) && !reaction.me) {
            await reaction.users.remove(user.id);
            return;
        }
        if (!isExPoll(message))
            return;
        const lastReactionEmojiId = tracer.get(message.channelId, message.id, user.id);
        tracer.set(message.channelId, message.id, user.id, reactionEmojiId);
        if (lastReactionEmojiId === undefined) {
            if (isGraspedReactions(message))
                return;
            await removeOtherReactions(message, user, reaction.emoji);
        }
        if (lastReactionEmojiId)
            await message.reactions.cache.get(lastReactionEmojiId)?.users.remove(user.id);
    }
    async function regulateRemoveVote(bot, reaction, user) {
        if (user.id === bot.user.id)
            return;
        const message = await reaction.message.fetch(false);
        if (!isPollMessage(bot, message)) {
            utils_1.Utils.removeMessageCache(message);
            return;
        }
        if (isEndPoll(message)) {
            await message.reactions.removeAll();
            return;
        }
        if (!isExPoll(message)) {
            if (!isFreePoll(message))
                await removeOutsideReactions(message, reaction.emoji);
            return;
        }
        const lastReactionEmojiId = tracer.get(message.channelId, message.id, user.id);
        if (lastReactionEmojiId === undefined) {
            tracer.clear(message.channelId, message.id, user.id);
            await removeOtherReactions(message, user, reaction.emoji);
        }
        else if (VoteTracer_1.VoteTracer.toEmojiId(reaction.emoji) === lastReactionEmojiId)
            tracer.clear(message.channelId, message.id, user.id);
    }
    function isPollMessage(bot, message) {
        return message.author.id === bot.user.id
            && [constants_1.COLORS.POLL, constants_1.COLORS.EXPOLL, constants_1.COLORS.ENDED].includes(message.embeds.at(0)?.color ?? 0);
    }
    function isExPoll(message) {
        return message.embeds.at(0)?.color === constants_1.COLORS.EXPOLL;
    }
    function isFreePoll(message) {
        return !message.reactions.cache.some(reaction => reaction.me);
    }
    function isEndPoll(message) {
        return message.embeds.at(0)?.color === constants_1.COLORS.ENDED;
    }
    function isGraspedReactions(message) {
        return !message.reactions.cache.some(reaction => reaction.count !== reaction.users.cache.size);
    }
    async function removeOtherReactions(message, user, excludeEmoji) {
        const reactions = message.reactions.cache
            .filter(reaction => reaction.me && reaction.emoji.identifier !== excludeEmoji.identifier);
        const removedReactions = await removeOutsideReactions(message, excludeEmoji);
        for (const reaction of reactions.values()) {
            if (VoteTracer_1.VoteTracer.toEmojiId(reaction.emoji) === tracer.get(message.channelId, message.id, user.id))
                continue;
            removedReactions.push(await reaction.users.remove(user.id));
        }
        return removedReactions;
    }
    function removeOutsideReactions(message, excludeEmoji) {
        return Promise.all(message.reactions.cache
            .filter(reaction => !reaction.me && reaction.emoji.identifier !== excludeEmoji.identifier)
            .map(reaction => reaction.remove()));
    }
})(Judge = exports.Judge || (exports.Judge = {}));
