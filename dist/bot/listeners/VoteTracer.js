"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteTracer = void 0;
const discord_js_1 = require("discord.js");
class VoteTracer {
    static toEmojiId(emoji) {
        return emoji.id ?? emoji.name ?? '';
    }
    trace = new discord_js_1.Collection();
    get(channelId, messageId, userId) {
        const messages = this.trace.get(channelId);
        const users = messages?.get(messageId);
        return users?.get(userId);
    }
    set(channelId, messageId, userId, emojiId) {
        let messages = this.trace.get(channelId);
        let users = messages?.get(messageId);
        if (users)
            users.set(userId, emojiId);
        else {
            users = new discord_js_1.Collection([[userId, emojiId]]);
            if (messages)
                messages.set(messageId, users);
            else {
                messages = new discord_js_1.Collection([[messageId, users]]);
                this.trace.set(channelId, messages);
            }
        }
        return this;
    }
    clear(channelId, messageId, userId) {
        return this.set(channelId, messageId, userId, null);
    }
    clearEmoji(message, emojiId) {
        const messages = this.trace.get(message.channelId);
        let users = messages?.get(message.id);
        if (!messages || !users)
            return;
        users = new discord_js_1.Collection(users.map((otherEmojiId, userId) => [userId, otherEmojiId === emojiId ? null : otherEmojiId]));
        messages.set(message.id, users);
    }
    delete(channelId, messageId, userId) {
        return this.trace
            .get(channelId)
            ?.get(messageId)
            ?.delete(userId) ?? false;
    }
    deleteChannel(channel) {
        return this.trace
            .delete(channel.id);
    }
    deleteMessage(message) {
        return this.trace
            .get(message.channelId)
            ?.delete(message.id) ?? false;
    }
}
exports.VoteTracer = VoteTracer;
