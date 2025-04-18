import { Collection } from 'discord.js';

import type { Snowflake, Channel, Message, PartialMessage, Emoji } from 'discord.js';

type ChannelId = Snowflake;
type MessageId = Snowflake;
type UserId    = Snowflake;
type EmojiId   = Snowflake | string;

export class VoteTracer {
  static toEmojiId(emoji: Emoji): EmojiId {
    return emoji.id ?? emoji.name ?? '';
  }

  private trace: Collection<ChannelId, Collection<MessageId, Collection<UserId, EmojiId | null>>> = new Collection();

  get(channelId: ChannelId, messageId: MessageId, userId: UserId): EmojiId | null | undefined {
    const messages = this.trace.get(channelId);
    const users = messages?.get(messageId);

    return users?.get(userId);
  }

  set(channelId: ChannelId, messageId: MessageId, userId: UserId, emojiId: EmojiId | null): this {
    let messages = this.trace.get(channelId);
    let users = messages?.get(messageId);

    if (users)
      users.set(userId, emojiId);
    else {
      users = new Collection([[userId, emojiId]]);

      if (messages)
        messages.set(messageId, users);
      else {
        messages = new Collection([[messageId, users]]);
        this.trace.set(channelId, messages);
      }
    }

    return this;
  }

  clear(channelId: ChannelId, messageId: MessageId, userId: UserId): this {
    return this.set(channelId, messageId, userId, null);
  }

  clearEmoji(message: Message | PartialMessage, emojiId: EmojiId): void {
    const messages = this.trace.get(message.channelId);
    let users = messages?.get(message.id);

    if (!messages || !users) return;

    users = new Collection(
      users.map((otherEmojiId, userId) => [userId, otherEmojiId === emojiId ? null : otherEmojiId])
    );
    messages.set(message.id, users);
  }

  delete(channelId: ChannelId, messageId: MessageId, userId: UserId): boolean {
    return this.trace
      .get(channelId)
      ?.get(messageId)
      ?.delete(userId) ?? false;
  }

  deleteChannel(channel: Channel): boolean {
    return this.trace
      .delete(channel.id);
  }

  deleteMessage(message: Message | PartialMessage): boolean {
    return this.trace
      .get(message.channelId)
      ?.delete(message.id) ?? false;
  }
}
