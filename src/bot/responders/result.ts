import {
  ChannelType,
  DiscordAPIError,
  EmbedBuilder,
  GuildTextBasedChannel,
  Message,
  Snowflake,
} from 'discord.js';

import { COLORS, COMMAND_PREFIX } from '../../constants';
import { Counter } from '../../transactions/counter';
import { Allocater, RequestChunk } from '../allotters/allocater';
import { Locales } from '../templates/locale';
import CommandError from './error';
import { Help } from './help';

export namespace Result {
  export function initialize() {
    Allocater.entryResponder(
      `${COMMAND_PREFIX}sumpoll`, chunk => respond(chunk, false)
    );
    Allocater.entryResponder(
      `${COMMAND_PREFIX}endpoll`, chunk => respond(chunk, true)
    );
  }

  async function respond(
    chunk: RequestChunk, isEnd: boolean
  ): Promise<Message<true> | null> {
    if (!chunk.args.length) return respondHelp(chunk);

    try {
      if (!validate(chunk, isEnd)) return null;

      Counter.count(isEnd ? 'endpoll' : 'sumpoll');

      const query = await parse(chunk, isEnd);
      if (query.isEnd) endPoll(chunk, query.poll);
      return respondResult(chunk, query);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return respondError(chunk, error);
      throw error;
    }
  }

  function respondHelp(chunk: RequestChunk): Promise<Message<true>> {
    const options = { embeds: [Help.getEmbed(chunk.lang)] };
    const channel = chunk.request.channel;
    const response = chunk.response;

    Counter.count('help');

    return response ? response.edit(options) : channel.send(options);
  }

  function respondError(
    chunk: RequestChunk, error: CommandError
  ): Promise<Message<true>> {
    const options = { embeds: [error.embed] };
    const channel = chunk.request.channel;
    const response = chunk.response;

    return response ? response.edit(options) : channel.send(options);
  }

  function validate(chunk: RequestChunk, isEnd: boolean): boolean {
    if (!isEnd) return true;

    const permissions = chunk.request.channel.permissionsFor(chunk.botID);
    if (!permissions) return false;

    const missings = permissions.missing('ManageMessages');

    if (missings.length)
      throw new CommandError('lackPermissions', chunk.lang, missings);

    return true;
  }

  type Author = { iconURL: string, name: string };
  type Choice = {
    emoji: string, text: string | null, count: number, rate: number
  };

  interface Query {
    poll     : Message<true>,
    isEnd  : boolean,
    author   : Author,
    imageURL : string | null,
    mentions : string[],
    question : string,
    choices  : Choice[],
  }

  async function parse(chunk: RequestChunk, isEnd: boolean): Promise<Query> {
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

    return {
      poll    : poll,
      isEnd   : isEnd,
      author  : parseAuthor(chunk, poll),
      imageURL: parseImage(poll),
      mentions: parseMentions(poll),
      question: parseQuestion(chunk, poll),
      choices : await parseChoices(poll),
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

  function parseAuthor(chunk: RequestChunk, poll: Message<true>): Author {
    const author = poll.embeds[0].author;
    if (!author?.iconURL || !author?.name)
      throw new CommandError('missingFormatPoll', chunk.lang);

    return { iconURL: author.iconURL, name: author.name }
  }

  function parseImage(poll: Message<true>): string | null {
    const attachment = poll.attachments.first();
    return attachment ? attachment.url : null;
  }

  function parseMentions(poll: Message<true>): string[] {
    return poll.content.split(' ');
  }

  function parseQuestion(chunk: RequestChunk, poll: Message<true>): string {
    const question = poll.embeds[0].title;
    if (!question) throw new CommandError('missingFormatPoll', chunk.lang);

    return question;
  }

  async function parseChoices(poll: Message<true>): Promise<Choice[]> {
    const reactions = await Promise.all(
      poll.reactions.cache.map(reaction => reaction.fetch())
    );
    const emojis = reactions.map(({ emoji }) => emoji.toString());
    const counts = reactions.map(
      ({ count, me }) => count ? count - Number(me) : 0
    );
    const total = counts.reduce((total, count) => total + count, 0);
    const rates = counts.map(count => count / (total || 1));

    const description = poll.embeds[0].description;
    const texts = new Map(
      [...(description?.matchAll(/\u200B(.+?) (.*?)\u200C/gs) ?? [])]
        .map(match => [match[1], match[2]])
    );

    return emojis.map((emoji, i) => (
      {
        emoji: emoji,
        text: texts.get(emoji) ?? null,
        count: counts[i],
        rate: rates[i],
      }
    ));
  }

  function endPoll(chunk: RequestChunk, poll: Message<true>): void {
    poll.reactions.removeAll()
      .catch(console.error);

    const embed = new EmbedBuilder(poll.embeds[0].toJSON());
    const template = Locales[chunk.lang].successes.endpoll();

    if (template.color)  embed.setColor(template.color);
    if (template.footer?.text) embed.setFooter({ text: template.footer.text });

    poll.edit({ embeds: [embed] })
      .catch(console.error);
  }

  function respondResult(
    chunk: RequestChunk, query: Query
  ): Promise<Message<true> | null> {
    const choices = query.choices;
    const maxRate = choices.reduce(
      (max, { rate }) => max < rate ? rate : max, 0
    );
    const graphs = choices.map(
      ({ rate }) => '\\|'.repeat(rate * (100 / maxRate / 1.5))
    );

    const emojis = choices.map(({ emoji }) => emoji);
    const texts  = choices.map(({ text }) => text ?? '');
    const counts = choices.map(({ count }) => count);
    const tops   = choices.map(({ rate }) => !!rate && rate === maxRate);
    const rates  = choices.map(({ rate }) => (rate * 100).toFixed(1));

    const options = {
      content: query.mentions.join(' ') || undefined,
      embeds: [Locales[chunk.lang].successes.graphpoll(
        query.poll.url,
        query.author.iconURL,
        query.author.name,
        query.question,
        emojis,
        texts,
        counts,
        tops,
        rates,
        graphs,
      )]
    }

    return chunk.response
      ? chunk.response.edit(options)
      : chunk.request.channel.send(options);
  }
}
