"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Judge = void 0;
const VoteCache_1 = require("./VoteCache");
const constants_1 = require("../../constants");
const utils_1 = require("../utils");
;
var Judge;
(function (Judge) {
    const cache = new VoteCache_1.VoteCache();
    function adjustCache(message) {
        cache.deleteMessage(message);
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
            cache.clearEmoji(reaction.message, VoteCache_1.VoteCache.toEmojiId(reaction.emoji));
        })
            .on('messageReactionRemoveAll', message => {
            cache.clearMessage(message);
        })
            .on('messageDelete', message => {
            cache.deleteMessage(message);
        })
            .on('channelDelete', channel => {
            cache.deleteChannel(channel);
        });
    }
    Judge.initialize = initialize;
    async function regulateAddVote(bot, reaction, user) {
        if (user.id === bot.user.id)
            return;
        const message = await reaction.message.fetch();
        if (!isPollMessage(bot, message)) {
            utils_1.Utils.removeMessageCache(message);
            return;
        }
        const refreshedReaction = message.reactions.cache.get(VoteCache_1.VoteCache.toEmojiId(reaction.emoji));
        if (!refreshedReaction)
            return;
        reaction = refreshedReaction;
        if (!isFreePoll(message) && !reaction.me) {
            await reaction.users.remove(user.id);
            return;
        }
        if (!isExPoll(message))
            return;
        const lastReactionEmojiId = cache.get(message.channelId, message.id, user.id);
        cache.set(message.channelId, message.id, user.id, VoteCache_1.VoteCache.toEmojiId(reaction.emoji));
        if (lastReactionEmojiId === null)
            return;
        if (lastReactionEmojiId === undefined)
            await removeOtherReactions(message, user, reaction.emoji.identifier);
        else
            await message.reactions.cache.get(lastReactionEmojiId)
                ?.users.remove(user.id);
    }
    async function regulateRemoveVote(bot, reaction, user) {
        if (user.id === bot.user.id)
            return;
        const message = await reaction.message.fetch();
        if (!isPollMessage(bot, message)) {
            utils_1.Utils.removeMessageCache(message);
            return;
        }
        const lastReactionEmojiId = cache.get(message.channelId, message.id, user.id);
        if (!isExPoll(message)) {
            if (!isFreePoll(message) && lastReactionEmojiId === undefined) {
                cache.clear(message.channelId, message.id, user.id);
                await removeOutsideReactions(message, user, reaction.emoji.identifier);
            }
            return;
        }
        if (lastReactionEmojiId !== undefined
            && VoteCache_1.VoteCache.toEmojiId(reaction.emoji) !== lastReactionEmojiId)
            return;
        cache.clear(message.channelId, message.id, user.id);
        if (lastReactionEmojiId === undefined)
            await removeOtherReactions(message, user, reaction.emoji.identifier);
    }
    function isPollMessage(bot, message) {
        return message.author.id === bot.user.id
            && [constants_1.COLORS.POLL, constants_1.COLORS.EXPOLL].includes(message.embeds.at(0)?.color ?? 0);
    }
    function isExPoll(message) {
        return message.embeds.at(0)?.color === constants_1.COLORS.EXPOLL;
    }
    function isFreePoll(message) {
        return !message.reactions.cache.some(reaction => reaction.me);
    }
    function removeOtherReactions(message, user, excludeEmojiIdentifier) {
        return Promise.all(message.reactions.cache
            .filter(reaction => reaction.emoji.identifier !== excludeEmojiIdentifier)
            .map(reaction => reaction.users.remove(user.id)));
    }
    function removeOutsideReactions(message, user, excludeEmojiIdentifier) {
        return Promise.all(message.reactions.cache
            .filter(reaction => !reaction.me && reaction.emoji.identifier !== excludeEmojiIdentifier)
            .map(reaction => reaction.users.remove(user.id)));
    }
})(Judge = exports.Judge || (exports.Judge = {}));
