import {
  DiscordAPIError,
  Message,
  NewsChannel,
  Snowflake,
  TextChannel
} from 'discord.js';

import { COLORS, COMMAND_PREFIX, USABLE_CHANNEL } from '../../constants';
import { Allocater, RequestData } from '../allotters/allocater';
import { Locales } from '../templates/locale';
import CommandError from './error';
import { Help } from './help';

export namespace Result {
  type Author = { iconURL: string, name: string };
  type Choice = {
    emoji: string, text: string | null, count: number, rate: number
  };

  interface Query {
    poll     : Message,
    endpoll  : boolean,
    author   : Author,
    imageURL : string | null,
    mentions : string[],
    question : string,
    choices  : Choice[],
  }

  async function respondError(
    data: RequestData, error: CommandError
  ): Promise<Message> {
    const options = { embed: error.embed };
    const channel = data.request.channel;
    const response = data.response;

    return response ? response.edit(options) : channel.send(options);
  }

  async function respondResult(
    data: RequestData, query: Query
  ): Promise<Message | null> {
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
      content: query.mentions.join(' '),
      embed: Locales[data.lang].successes.graphpoll(
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
      )
    }

    return data.response
      ? data.response.edit(options)
      : data.request.channel.send(options);
  }

  function endPoll(data: RequestData, poll: Message): void {
    poll.reactions.removeAll()
      .catch(console.error);

    const embed = poll.embeds[0];
    const template = Locales[data.lang].successes.endpoll();

    if (template.color)  embed.setColor(template.color);
    if (template.footer) embed.setFooter(template.footer.text);

    poll.edit({ embed })
      .catch(console.error);
  }

  async function parseChoices(poll: Message): Promise<Choice[]> {
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
      [...(description?.matchAll(/\u200B(.+?) (.+?)\u200C/g) ?? [])]
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

  function parseQuestion(data: RequestData, poll: Message): string {
    const question = poll.embeds[0].title;
    if (!question) throw new CommandError('missingFormatPoll', data.lang);

    return question;
  }

  function parseMentions(poll: Message): string[] {
    return poll.content.split(' ');
  }

  function parseImage(poll: Message): string | null {
    const attachment = poll.attachments.first();
    return attachment ? attachment.url : null;
  }

  function parseAuthor(data: RequestData, poll: Message): Author {
    const author = poll.embeds[0].author;
    if (!author?.iconURL || !author?.name)
      throw new CommandError('missingFormatPoll', data.lang);

    return { iconURL: author.iconURL, name: author.name }
  }

  function isPoll(data: RequestData, poll: Message): boolean {
    const embed = poll.embeds[0];

    return !!(
      poll.author.id === data.botID
      && embed?.color
      && [COLORS.POLL, COLORS.EXPOLL].includes(embed.color)
    );
  }
  function getChannel(
    request: Message, channelID: Snowflake | null
  ): USABLE_CHANNEL | null {
    if (request.channel.type === 'dm') return null;
    if (!channelID) return request.channel;

    const channel = request.guild?.channels.cache.get(channelID);
    if (channel instanceof TextChannel || channel instanceof NewsChannel)
      return channel;
    else
      return null;
  }

  function parseIDs(data: RequestData): [string | null, string | null] {
    const match = data.args[0].match(/^((\d+)-)?(\d+)$/);
    if (!match) return [null, null];

    return [match[2], match[3]];
  }


  async function parse(data: RequestData, endpoll: boolean): Promise<Query> {
    const [channelID, messageID] = parseIDs(data);
    if (!messageID) throw new CommandError('ungivenMessageID', data.lang);

    const channel = getChannel(data.request, channelID);
    if (!channel) throw new CommandError('notFoundChannel', data.lang);

    let poll: Message;

    try {
      poll = await channel.messages.fetch(messageID);
    }
    catch (error: unknown) {
      if (error instanceof DiscordAPIError)
        if (error.httpStatus === 404)
          throw new CommandError('notFoundPoll', data.lang);

      throw error;
    }

    if (!isPoll(data, poll)) throw new CommandError('notFoundPoll', data.lang);

    return {
      poll    : poll,
      endpoll : endpoll,
      author  : parseAuthor(data, poll),
      imageURL: parseImage(poll),
      mentions: parseMentions(poll),
      question: parseQuestion(data, poll),
      choices : await parseChoices(poll),
    };
  }

  function respondHelp(data: RequestData): Promise<Message> {
    const options = { content: '', embed: Help.getEmbed(data.lang) };
    const channel = data.request.channel;
    const response = data.response;

    return response ? response.edit(options) : channel.send(options);
  }

  async function respond(
    data: RequestData, endpoll: boolean
  ): Promise<Message | null> {
    if (!data.args.length) return respondHelp(data);

    try {
      const query = await parse(data, endpoll);
      if (query.endpoll) endPoll(data, query.poll);
      return respondResult(data, query);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return respondError(data, error);
      throw error;
    }
  }

  export function initialize() {
    Allocater.responders.set(
      `${COMMAND_PREFIX}sumpoll`, data => respond(data, false)
    );
    Allocater.responders.set(
      `${COMMAND_PREFIX}endpoll`, data => respond(data, true)
    );
  }
}