import {
  Client,
  Message,
  MessageReaction,
  PartialUser,
  Snowflake,
  User,
} from 'discord.js';
import { COLORS } from '../../constants';
import { Utils } from '../utils';

export namespace Judge {
  export function initialize(bot: Client, botID: Snowflake): void {
    bot.on('messageReactionAdd', (vote, user) => manipulate(vote, user, botID));
  }

  function manipulate(
    vote: MessageReaction, user: User | PartialUser, botID: Snowflake
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
    vote: MessageReaction, user: User | PartialUser, botID: Snowflake
  ): Promise<MessageReaction[]> {
    if (user.bot) return [];

    const poll = await Utils.fetchMessage(vote.message);
    if (!poll) return [];

    const embed = poll.embeds[0];
    if (poll.author.id !== botID || !embed) {
      Utils.removeMessageCache(poll);
      return [];
    }

    if (embed.color === COLORS.POLL)   return parsePoll(poll, vote);
    if (embed.color === COLORS.EXPOLL) return parseExpoll(poll, vote, user);
    if (embed.color === COLORS.ENDED)  return [vote];

    Utils.removeMessageCache(poll);
    return [];
  }

  function parsePoll(
    poll: Message, vote: MessageReaction
  ): MessageReaction[] {
    const myReactions = poll.reactions.cache.filter(({ me }) => me);
    if (!myReactions.size) return [];

    const emoji = vote.emoji;
    return myReactions.has(emoji.id ?? emoji.name) ? [] : [vote];
  }

  function parseExpoll(
    poll: Message, vote: MessageReaction, user: User | PartialUser
  ): MessageReaction[] {
    const ejectVotes = parsePoll(poll, vote);
    if (ejectVotes.length && !vote.partial) return ejectVotes;

    poll.reactions.cache.get(vote.emoji.id ?? vote.emoji.name)?.users.add(user);

    return ejectVotes.concat(poll.reactions.cache.filter(({ users, emoji }) =>
      (vote.partial || users.cache.has(user.id)) && !(
        emoji.name && emoji.name === vote.emoji.name
        && emoji.id === vote.emoji.id
      )
    ).array());
  }
}
