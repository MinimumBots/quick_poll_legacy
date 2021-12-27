import { VoteTracer } from './VoteTracer';
import { COLORS } from '../../constants';
import { Utils } from '../utils'

import type {
  Client,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
  Emoji,
  PartialMessage,
} from 'discord.js';

type UnionUser = User | PartialUser;
type UnionMessage = Message | PartialMessage;
type UnionMessageReaction = MessageReaction | PartialMessageReaction;

export namespace Judge {
  const tracer = new VoteTracer();

  export function adjustCache(message: Message): false {
    tracer.deleteMessage(message)
    return false;
  }

  export function initialize(bot: Client<true>): void {
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
        tracer.clearEmoji(reaction.message, VoteTracer.toEmojiId(reaction.emoji));
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

  async function regulateAddVote(
    bot: Client<true>, reaction: UnionMessageReaction, user: UnionUser
  ): Promise<void> {
    if (user.id === bot.user.id) return;

    const message = await refineMessage(reaction.message);
    if (!message) return;

    const reactionEmojiId = VoteTracer.toEmojiId(reaction.emoji);
    const refreshedReaction = message.reactions.cache.get(reactionEmojiId);
    if (!refreshedReaction) return;
    reaction = refreshedReaction;

    if (!isFreePoll(message) && !reaction.me) {
      await reaction.users.remove(user.id);
      return;
    }

    if (!isExPoll(message)) return;

    const lastReactionEmojiId = tracer.get(message.channelId, message.id, user.id);
    tracer.set(message.channelId, message.id, user.id, reactionEmojiId);

    switch (lastReactionEmojiId) {
      case undefined:
        if (isGraspedReactions(message)) break;
        await removeOtherReactions(message, user, reaction.emoji);
      case null:
        break;
      default:
        await message.reactions.cache.get(lastReactionEmojiId)?.users.remove(user.id);
    }
  }

  async function regulateRemoveVote(
    bot: Client<true>, reaction: UnionMessageReaction, user: UnionUser
  ): Promise<void> {
    if (user.id === bot.user.id) return;

    const message = await refineMessage(reaction.message);
    if (!message) return;

    if (!isExPoll(message)) {
      if (!isFreePoll(message)) await removeOutsideReactions(message, reaction.emoji);
      return;
    }

    const lastReactionEmojiId = tracer.get(message.channelId, message.id, user.id);

    switch (lastReactionEmojiId) {
      case undefined:
        tracer.clear(message.channelId, message.id, user.id);
        await removeOtherReactions(message, user, reaction.emoji);
      case null:
        break;
      case VoteTracer.toEmojiId(reaction.emoji):
        tracer.clear(message.channelId, message.id, user.id);
      default:
    }
  }

  async function refineMessage(message: UnionMessage): Promise<Message | null> {
    message = await message.fetch(false);

    if (!isPollMessage(message.client, message)) {
      Utils.removeMessageCache(message);
      return null;
    }

    if (isEndPoll(message)) {
      await message.reactions.removeAll();
      return null;
    }

    return message;
  }

  function isPollMessage(bot: Client<true>, message: Message): boolean {
    return message.author.id === bot.user.id
      && [COLORS.POLL, COLORS.EXPOLL, COLORS.ENDED].includes(message.embeds.at(0)?.color ?? 0);
  }

  function isExPoll(message: Message): boolean {
    return message.embeds.at(0)?.color === COLORS.EXPOLL;
  }

  function isFreePoll(message: Message): boolean {
    return !message.reactions.cache.some(reaction => reaction.me);
  }

  function isEndPoll(message: Message): boolean {
    return message.embeds.at(0)?.color === COLORS.ENDED;
  }

  function isGraspedReactions(message: Message): boolean {
    return !message.reactions.cache.some(reaction => reaction.count !== reaction.users.cache.size);
  }

  async function removeOtherReactions(
    message: Message, user: UnionUser, excludeEmoji: Emoji
  ): Promise<MessageReaction[]> {
    const reactions = message.reactions.cache
      .filter(reaction => reaction.me && reaction.emoji.identifier !== excludeEmoji.identifier);
    const removedReactions = await removeOutsideReactions(message, excludeEmoji);

    for (const reaction of reactions.values()) {
      if (VoteTracer.toEmojiId(reaction.emoji) === tracer.get(message.channelId, message.id, user.id))
        continue;

      removedReactions.push(await reaction.users.remove(user.id));
    }

    return removedReactions;
  }

  function removeOutsideReactions(
    message: Message, excludeEmoji: Emoji
  ): Promise<MessageReaction[]> {
    return Promise.all(
      message.reactions.cache
        .filter(reaction => !reaction.me && reaction.emoji.identifier !== excludeEmoji.identifier)
        .map(reaction => reaction.remove())
    );
  }
}
