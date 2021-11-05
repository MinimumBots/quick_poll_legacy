"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteCache = void 0;
const discord_js_1 = require("discord.js");
class VoteCache {
    constructor() {
        this.cache = new discord_js_1.Collection();
    }
    static toEmojiId(emoji) {
        return emoji.id ?? emoji.name ?? '';
    }
    get(channelId, messageId, userId) {
        const messages = this.cache.get(channelId);
        const users = messages?.get(messageId);
        return users?.get(userId);
    }
    set(channelId, messageId, userId, emojiId) {
        let messages = this.cache.get(channelId);
        let users = messages?.get(messageId);
        if (users)
            users.set(userId, emojiId);
        else {
            users = new discord_js_1.Collection([[userId, emojiId]]);
            if (messages)
                messages.set(messageId, users);
            else {
                messages = new discord_js_1.Collection([[messageId, users]]);
                this.cache.set(channelId, messages);
            }
        }
        return this;
    }
    clear(channelId, messageId, userId) {
        return this.set(channelId, messageId, userId, null);
    }
    clearEmoji(message, emojiId) {
        const messages = this.cache.get(message.channelId);
        let users = messages?.get(message.id);
        if (!messages || !users)
            return;
        users = new discord_js_1.Collection(users.map((otherEmojiId, userId) => [userId, otherEmojiId === emojiId ? null : otherEmojiId]));
        messages.set(message.id, users);
    }
    clearMessage(message) {
        const messages = this.cache.get(message.channelId);
        let users = messages?.get(message.id);
        if (!messages || !users)
            return;
        users = new discord_js_1.Collection(users.map((_, userId) => [userId, null]));
        messages.set(message.id, users);
    }
    delete(channelId, messageId, userId) {
        return this.cache
            .get(channelId)
            ?.get(messageId)
            ?.delete(userId) ?? false;
    }
    deleteChannel(channel) {
        return this.cache
            .delete(channel.id);
    }
    deleteMessage(message) {
        return this.cache
            .get(message.channelId)
            ?.delete(message.id) ?? false;
    }
}
exports.VoteCache = VoteCache;
