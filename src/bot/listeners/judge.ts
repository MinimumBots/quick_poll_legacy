import {
  Client,
  Collection,
  Message,
  MessageReaction,
  NewsChannel,
  PartialMessageReaction,
  PartialUser,
  Snowflake,
  TextBasedChannels,
  TextChannel,
  User,
} from 'discord.js';
import { COLORS, MESSAGE_SWEEP_INTERVAL } from '../../constants';
import { Utils } from '../utils';

export namespace Judge {
  export function initialize(bot: Client<true>): void {
    bot.on('messageReactionAdd', (vote, user) => manipulate(vote, user, bot.user.id));
    setInterval(() => sweepKnownUsers(bot), MESSAGE_SWEEP_INTERVAL);
  }

  function manipulate(
    vote: MessageReaction | PartialMessageReaction, user: User | PartialUser, botID: Snowflake
  ): void {
    parse(vote, user, botID)
      .then(ejectVotes =>
        Promise.all(
          ejectVotes.map(({ users }) => users.remove(user.id))
        ).catch(() => undefined)
      )
      .catch(console.error);
  }

  async function parse(
    vote: MessageReaction | PartialMessageReaction, user: User | PartialUser, botID: Snowflake
  ): Promise<(MessageReaction | PartialMessageReaction)[]> {
    if (user.bot) return [];

    const poll = await Utils.fetchMessage(vote.message);
    if (!poll) return [];

    const embed = poll.embeds[0];
    if (poll.author.id !== botID || !embed) {
      Utils.removeMessageCache(poll);
      return [];
    }

    user = await user.fetch();

    if (embed.color === COLORS.POLL)   return parsePoll(poll, vote);
    if (embed.color === COLORS.EXPOLL) return parseExpoll(poll, vote, user);
    if (embed.color === COLORS.ENDED)  return [vote];

    Utils.removeMessageCache(poll);
    return [];
  }

  function parsePoll(
    poll: Message, vote: MessageReaction | PartialMessageReaction
  ): (MessageReaction | PartialMessageReaction)[] {
    const myReactions = poll.reactions.cache.filter(({ me }) => me);
    if (!myReactions.size) return [];

    const emoji = vote.emoji;
    return myReactions.has(emoji.id ?? emoji.name ?? '') ? [] : [vote];
  }

  function parseExpoll(
    poll: Message, vote: MessageReaction | PartialMessageReaction, user: User
  ): (MessageReaction | PartialMessageReaction)[] {
    const ejectVotes = parsePoll(poll, vote);
    const known = isKnownUser(poll.channel, poll, user);
    if (ejectVotes.length && known) return ejectVotes;

    poll.reactions.cache.get(vote.emoji.id ?? vote.emoji.name ?? '')?.users.cache.set(user.id, user);

    ejectVotes.push(
      ...poll.reactions.cache.filter(({ users, emoji }) =>
        (!known || users.cache.has(user.id)) && !(
          emoji.name && emoji.name === vote.emoji.name
          && emoji.id === vote.emoji.id
        )
      ).values()
    );

    rememberUser(poll.channel, poll, user);

    return ejectVotes;
  }

  type ChannelID = Snowflake;
  type MessageID = Snowflake;
  type UserID    = Snowflake;
  const knownUserIDs: Map<
    ChannelID, Collection<MessageID, Set<UserID>>
  > = new Map;

  function rememberUser(
    channel: TextBasedChannels, message: Message, user: User | PartialUser
  ): void {
    const messageIDs = knownUserIDs.get(channel.id);
    const userIDs = messageIDs?.get(message.id);

    if (userIDs)
      userIDs.add(user.id);
    else {
      if (messageIDs)
        messageIDs.set(message.id, new Set(user.id));
      else
        knownUserIDs.set(
          channel.id, new Collection([[message.id, new Set(user.id)]])
        );
    }
  }

  function isKnownUser(
    channel: TextBasedChannels, message: Message, user: User | PartialUser
  ): boolean {
    const userIDs = knownUserIDs.get(channel.id)?.get(message.id);
    return !!userIDs && userIDs.has(user.id);
  }

  function sweepKnownUsers(bot: Client<true>): void {
    const channels = bot.channels.cache;

    knownUserIDs.forEach((messageIDs, channelID) => {
      const channel = channels.get(channelID);
      if (!(channel instanceof TextChannel || channel instanceof NewsChannel))
        return;

      messageIDs.sweep((_, id) => !channel.messages.cache.has(id));
    });
  }
}
