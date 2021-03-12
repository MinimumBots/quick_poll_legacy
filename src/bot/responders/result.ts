import { DiscordAPIError, Message, Snowflake, TextChannel } from 'discord.js';

import { COLORS, COMMAND_PREFIX, USABLE_CHANNEL, USABLE_GUILD_CHANNEL } from '../../constants';
import { Allocater, RequestData } from '../allotters/allocater';
import CommandError from './error';
import { Help } from './help';

export namespace Result {
  type Choice = { emoji: string, text: string | null };
  type Author = { iconURL: string, name: string };

  interface Query {
    endpoll : boolean,
    author  : Author,
    imageURL: string | null,
    mentions: string[],
    question: string;
    choices : Choice[],
  }

  async function respondResult(
    data: RequestData, query: Query
  ): Promise<Message | null> {
    
  }

  function parseChoices(data: RequestData, poll: Message): Choice[] {
    const description = poll.embeds[0].description
    const matchs = [
      ...(description?.matchAll(/\u200B(.+?) (.+?)\u200C/g) ?? [])
    ];
    return matchs.map(match => ({ emoji: match[1], text: match[2] }));
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
    return channelID
      ? request.guild?.channels.cache.find(channel => (
        (channel.type === 'text' || channel.type === 'news')
        && channel.id === channelID
      )) as USABLE_GUILD_CHANNEL | undefined ?? null
      : request.channel;
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
        if (error.code === 404)
          throw new CommandError('notFoundPoll', data.lang);

      throw error;
    }

    if (!isPoll(data, poll)) throw new CommandError('notFoundPoll', data.lang);

    return {
      endpoll : endpoll,
      author  : parseAuthor(data, poll),
      imageURL: parseImage(poll),
      mentions: parseMentions(poll),
      question: parseQuestion(data, poll),
      choices : parseChoices(data, poll),
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