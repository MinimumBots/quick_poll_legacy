import { VoteCache } from './VoteCache';
import { COLORS } from '../../constants';
import { Utils } from '../utils'

import type {
  Client,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
  Snowflake,
} from 'discord.js';;

type RoughUser = User | PartialUser;
type RoughMessageReaction = MessageReaction | PartialMessageReaction;

export namespace Judge {
  const cache = new VoteCache();

  export function adjustCache(message: Message): false {
    cache.deleteMessage(message)

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
        cache.clearEmoji(reaction.message, VoteCache.toEmojiId(reaction.emoji));
      })
      .on('messageReactionRemoveAll', message => {
        cache.clearMessage(message);
      })
      .on('messageDelete', message => {
        cache.deleteMessage(message);
      })
      .on('channelDelete', channel => {
        cache.deleteChannel(channel);
      })
      .on('guildDelete', guild => {
        guild.channels.cache.each(channel => cache.deleteChannel(channel));
      });
  }

  async function regulateAddVote(
    bot: Client<true>, reaction: RoughMessageReaction, user: RoughUser
  ): Promise<void> {
    if (user.id === bot.user.id) return;

    const message = await reaction.message.fetch(false);
    if (!isPollMessage(bot, message)) {
      Utils.removeMessageCache(message);
      return;
    }

    const reactionEmojiId = VoteCache.toEmojiId(reaction.emoji);
    const refreshedReaction = message.reactions.cache.get(reactionEmojiId);
    if (!refreshedReaction) return;
    reaction = refreshedReaction;

    if (!isFreePoll(message) && !reaction.me) {
      await reaction.users.remove(user.id);
      return;
    }

    if (!isExPoll(message)) return;

    const lastReactionEmojiId = cache.get(message.channelId, message.id, user.id);
    cache.set(message.channelId, message.id, user.id, reactionEmojiId);

    if (lastReactionEmojiId === null) return;

    if (lastReactionEmojiId === undefined)
      await removeOtherReactions(message, user, reaction.emoji.identifier);
    else
      await message.reactions.cache.get(lastReactionEmojiId)?.users.remove(user.id);
  }

  async function regulateRemoveVote(
    bot: Client<true>, reaction: RoughMessageReaction, user: RoughUser
  ): Promise<void> {
    if (user.id === bot.user.id) return;

    const message = await reaction.message.fetch(false);
    if (!isPollMessage(bot, message)) {
      Utils.removeMessageCache(message);
      return;
    }

    const lastReactionEmojiId = cache.get(message.channelId, message.id, user.id);

    if (!isExPoll(message)) {
      if (!isFreePoll(message) && lastReactionEmojiId === undefined) {
        cache.clear(message.channelId, message.id, user.id);
        await removeOutsideReactions(message, reaction.emoji.identifier);
      }
      return;
    }

    if (
      lastReactionEmojiId !== undefined
        && VoteCache.toEmojiId(reaction.emoji) !== lastReactionEmojiId
    ) return;

    cache.clear(message.channelId, message.id, user.id);

    if (lastReactionEmojiId === undefined)
      await removeOtherReactions(message, user, reaction.emoji.identifier);
  }

  function isPollMessage(bot: Client<true>, message: Message): boolean {
    return message.author.id === bot.user.id
      && [COLORS.POLL, COLORS.EXPOLL].includes(message.embeds.at(0)?.color ?? 0);
  }

  function isExPoll(message: Message): boolean {
    return message.embeds.at(0)?.color === COLORS.EXPOLL;
  }

  function isFreePoll(message: Message): boolean {
    return !message.reactions.cache.some(reaction => reaction.me);
  }

  async function removeOtherReactions(
    message: Message, user: RoughUser, excludeEmojiIdentifier: Snowflake | string
  ): Promise<MessageReaction[]> {
    const reactions = message.reactions.cache
      .filter(reaction => reaction.me && reaction.emoji.identifier !== excludeEmojiIdentifier);
    const removedReactions = await removeOutsideReactions(message, excludeEmojiIdentifier);

    for (const reaction of reactions.values()) {
      if (VoteCache.toEmojiId(reaction.emoji) === cache.get(message.channelId, message.id, user.id))
        continue;

      removedReactions.push(await reaction.users.remove(user.id));
    }

    return removedReactions;
  }

  function removeOutsideReactions(
    message: Message, excludeEmojiIdentifier: Snowflake | string
  ): Promise<MessageReaction[]> {
    return Promise.all(
      message.reactions.cache
        .filter(reaction => !reaction.me && reaction.emoji.identifier !== excludeEmojiIdentifier)
        .map(reaction => reaction.remove())
    );
  }
}
