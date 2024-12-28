import {
  ChannelType,
  Collection,
  DiscordAPIError,
  GuildEmoji,
  GuildTextBasedChannel,
  Message,
  ReactionEmoji,
  Snowflake,
  User,
} from 'discord.js';

import { COLORS, COMMAND_PREFIX } from '../../constants';
import { Counter } from '../../transactions/counter';
import { Allocater, RequestChunk } from '../allotters/allocater';
import CommandError from './error';
import { Help } from './help';

export namespace Export {
  export function initialize(): void {
    Allocater.entryResponder(
      `${COMMAND_PREFIX}csvpoll`, chunk => respond(chunk)
    );
  }

  type Choice = {
    emoji: GuildEmoji | ReactionEmoji,
    text: string | null,
    count: number,
    rate: number,
  };
  type Votes = Collection<User, boolean[]>;

  interface Query {
    poll: Message<true>,
    choices: Choice[],
    votes: Votes,
  }

  async function respond(chunk: RequestChunk): Promise<Message<true> | null> {
    if (!chunk.args.length) return respondHelp(chunk);

    try {
      if (chunk.response)
        throw new CommandError('unavailableExport', chunk.lang);
      if (!validatePermissions) return null;

      Counter.count('csvpoll');

      const query = await parse(chunk);
      const csv = generateCSV(query);
      return respondCSV(chunk, query, csv);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return respondError(chunk, error);
      throw error;
    }
  }

  function validatePermissions(chunk: RequestChunk): boolean {
    const channel = chunk.request.channel;
    const permissions = channel.permissionsFor(chunk.botID);
    if (!permissions) return false;

    const missings = permissions.missing('AttachFiles');

    if (missings.length)
      throw new CommandError('lackPermissions', chunk.lang, missings);

    return true;
  }

  function respondHelp(chunk: RequestChunk): Promise<Message<true>> {
    Counter.count('help');

    return chunk.request.channel.send({ embeds: [Help.getEmbed(chunk.lang)] });
  }

  function respondError(
    chunk: RequestChunk, error: CommandError
  ): Promise<Message<true>> {
    return chunk.request.channel.send({ embeds: [error.embed] });
  }

  async function parse(chunk: RequestChunk): Promise<Query> {
    const [channelID, messageID] = parseIDs(chunk);
    if (!messageID) throw new CommandError('ungivenMessageID', chunk.lang);

    const channel = getChannel(chunk.request, channelID);
    if (!channel) throw new CommandError('notFoundChannel', chunk.lang);

    let poll: Message<true>;

    try {
      poll = await channel.messages.fetch(messageID);
    }
    catch (error: unknown) {
      if (error instanceof DiscordAPIError)
        if (error.status === 404)
          throw new CommandError('notFoundPoll', chunk.lang);

      throw error;
    }

    if (!isPoll(chunk, poll))
      throw new CommandError('notFoundPoll', chunk.lang);

    const choices = await parseChoices(poll);

    return {
      poll: poll,
      choices: choices,
      votes: await parseVotes(poll),
    };
  }

  function parseIDs(chunk: RequestChunk): [string | null, string | null] {
    const match = chunk.args[0].match(/^((\d+)-)?(\d+)$/);
    if (!match) return [null, null];

    return [match[2], match[3]];
  }

  function getChannel(
    request: Message<true>, channelID: Snowflake | null
  ): GuildTextBasedChannel | null {
    if (!channelID) return request.channel;

    const channel = request.guild?.channels.cache.get(channelID);
    if (channel?.isTextBased())
      return channel;
    else
      return null;
  }

  function isPoll(chunk: RequestChunk, poll: Message<true>): boolean {
    const embed = poll.embeds[0];

    return !!(
      poll.author.id === chunk.botID
      && embed?.color
      && [COLORS.POLL, COLORS.EXPOLL].includes(embed.color)
    );
  }

  async function parseChoices(poll: Message<true>): Promise<Choice[]> {
    const reactions = await Promise.all(
      poll.reactions.cache.map(reaction => reaction.fetch())
    );
    const emojis = reactions.map(({ emoji }) => emoji);
    const counts = reactions.map(
      ({ count, me }) => count ? count - Number(me) : 0
    );
    const total = counts.reduce((total, count) => total + count, 0);
    const rates = counts.map(count => count / (total || 1));

    const description = poll.embeds[0].description;
    const texts = new Map(
      [...(description?.matchAll(/\u200B(.+?) (.+?)\u200C/g) ?? [])]
        .map(([_, emoji, text]) => [emoji, text])
    );

    return emojis.map((emoji, i) => (
      {
        emoji: emoji,
        text: texts.get(emoji.toString()) ?? null,
        count: counts[i],
        rate: rates[i],
      }
    ));
  }

  async function parseVotes(poll: Message<true>): Promise<Votes> {
    const votes: Votes = new Collection;
    const reactions = poll.reactions.cache;
    const reactionsUsers = await Promise.all(
      reactions.map(({ users }) => users.fetch())
    );

    reactionsUsers.forEach((users, i) => {
      users.forEach(user => {
        if (user.bot) return;

        const vote = votes.get(user) ?? Array(i).fill(false);
        vote[i] = true;
        votes.set(user, vote);
      });

      votes.forEach(vote => vote[i] ??= false);
    });

    return votes;
  }

  function generateCSV(query: Query): Buffer {
    let csv = 'Users,' + query.choices.map(({ emoji, text }) => {
      if (emoji instanceof ReactionEmoji)
        return `"${emoji}${text?.replace(/"/g, '""') || ''}"`;
      if (emoji instanceof GuildEmoji)
        return text ? text.replace(/"/g, '""') : emoji.name;
    }).join(',') + '\n';

    csv += query.votes.map((vote, user) => (
      `${user.tag},${vote.map(flag => flag ? '◯' : '').join(',')}`
    )).join('\n') + '\n';

    csv += ',' + query.choices.map(
      ({ count, rate }) => `${count} (${(rate * 100).toFixed(1)}%)`
    ).join(',') + '\n';

    return Buffer.from('\uFEFF' + csv, 'utf8');
  }

  function respondCSV(
    chunk: RequestChunk, query: Query, csv: Buffer
  ): Promise<Message<true>> {
    return chunk.request.channel.send(
      { files: [{ attachment: csv, name: `${query.poll.id}.csv` }] }
    );
  }
}
