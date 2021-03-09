import {
  Collection,
  Channel,
  Permissions,
  MessageEmbedOptions,
  Snowflake,
  GuildChannel,
  HTTPError,
  PermissionString,
  Guild,
  Message,
} from 'discord.js';

import {
  ASSUMING_DM_PERMISSIONS,
  COMMAND_PREFIX,
  MINIMUM_BOT_PERMISSIONS,
  USABLE_GUILD_CHANNEL,
} from '../../constants';
import { Locales } from '../templates/locale';
import { Allocater, RequestData, Responder } from '../allotters/allocater';
import CommandError from './error';

export namespace Poll {
  type Channels = Collection<Snowflake, Channel>;
  type Choice = { emoji: string, text: string | null, external: boolean };
  type Author = { iconURL: string, name: string };

  interface Parsed {
    response : Message;
    exclusive: boolean;
    mentions : string[];
    author   : Author;
    image    : string | null;
    question : string | null;
    choices  : Choice[];
  }

  function renderEmbed(data: RequestData, parsed: Parsed): MessageEmbedOptions {
    return Locales[data.lang].successes.poll()
  }

  async function renderSelectors(
    data: RequestData, parsed: Parsed
  ): Promise<void> {
    try {
      await Promise.all(
        parsed.choices.map(choice => data.response?.react(choice.emoji))
      );
    }
    catch (exception: unknown) {
      if (exception instanceof HTTPError)
        if (exception.code === 400)
          throw new CommandError('unusableEmoji', data.lang);
    }
    return;
  }

  const pollPermissions: PermissionString[] = [
    'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'
  ];
  const expollPermissions: PermissionString[] = [
    'MANAGE_MESSAGES'
  ];

  const mentionPermissons: PermissionString[] = [
    'MENTION_EVERYONE'
  ];

  function comparePermissions(data: RequestData, parsed: Parsed) {
    const request = data.request;
    const channel = parsed.response.channel;
    const user = request.author;
    const botUser = request.client.user;
    if (!botUser || !channel) return;

    const myPermissions = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(botUser);
    const authorPermissons = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(user);
  }

  const defaultEmojis = [
    '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲',
    '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
  ];
  const twemojiRegex
    = require('twemoji-parser/dist/lib/regex.js').default as RegExp;
  const emojiRegex
    = new RegExp(`^(${twemojiRegex.toString().slice(1, -2)}|<a?:.+?:\\d+>)$`);

  function isLocalGuildEmoji(guild: Guild | null, emoji: string): boolean {
    const match = emoji.match(/^<a?:.+?:(\d+)>$/);
    return guild && match ? guild.emojis.cache.has(match[1]) : false;
  }

  function generateChoices(data: RequestData): Choice[] {
    const emojis: string[] = [], texts: (string | null)[] = [];
    let external = false;

    data.args.forEach(arg => {
      if (emojiRegex.test(arg)) {
        const length = emojis.push(arg);
        if (texts.length < length - 1) texts.push(null);

        external ||= !isLocalGuildEmoji(data.request.guild, arg);
      }
      else {
        const length = texts.push(arg);
        if (emojis.length < length) emojis.push(defaultEmojis[length - 1]);
      }
    });

    return emojis.map((emoji, i) => ({ emoji, text: texts[i], external }));
  }

  const twoChoiceEmojis = ['⭕', '❌'];

  function generateTwoChoices(): Choice[] {
    return twoChoiceEmojis.map(emoji => (
      { emoji: emoji, text: null, external: false }
    ));
  }

  function parseChoices(
    data: RequestData, question: Parsed['question']
  ): Choice[] {
    if (!question) return [];
    if (!data.args.length) return generateTwoChoices();
    return generateChoices(data);
  }

  function parseQuestion(
    data: RequestData, mentions: Parsed['mentions']
  ): string | null {
    const question = data.args.shift();

    if (question === undefined) {
      if (mentions) throw new CommandError('ungivenQuestion', data.lang);
      return null;
    }
    return question;
  }

  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

  function parseAttachment(data: RequestData): string | null {
    return data.request.attachments.find(attachment => {
      const match = attachment.url.match(/\.(\w+)$/);
      return match ? imageExtensions.includes(match[1]) : false;
    })?.url ?? null
  }

  function parseAuthor(data: RequestData): Author {
    const user = data.request.author;
    const member = data.request.member;

    return {
      iconURL: user.displayAvatarURL(),
      name   : member?.displayName ?? user.username,
    };
  }

  function parseMentions(data: RequestData): string[] {
    const mentions: string[] = [];

    for (const arg of data.args) {
      const match = arg.match(/^(@everyone|@here|<@&(\d+)>)$/);
      if (!match) break;

      if (match[2])
        if (data.request.mentions.roles.has(match[2]))
          throw new CommandError('unusableRole', data.lang);

      data.args.shift();
      mentions.push(arg);
    }
    return mentions;
  }

  function searchChannel(
    data: RequestData, channelID: Snowflake
  ): USABLE_GUILD_CHANNEL {
    const channels = data.request.mentions.channels as Channels;

    const channel = channels.get(channelID);
    if (!channel) throw new CommandError('unusableChannel', data.lang);
    if (channel.type === 'dm')
      throw new CommandError('unavailableChannel', data.lang);
    if (
      !(channel instanceof GuildChannel)
      || channel.guild.id !== data.request.guild?.id
      || !channel.isText()
    ) throw new CommandError('unusableChannel', data.lang);
    return channel;
  }

  function parseChannel(data: RequestData): USABLE_GUILD_CHANNEL | null {
    let channel: USABLE_GUILD_CHANNEL | null = null;

    for (const arg of data.args) {
      const match = arg.match(/^<#(\d+)>$/);
      if (!match) break;

      if (channel) throw new CommandError('duplicateChannels', data.lang);

      data.args.shift();
      channel = searchChannel(data, match[1]);
    }
    return channel;
  }

  const prefixes = {
    poll  : `${COMMAND_PREFIX}poll`,
    expoll: `${COMMAND_PREFIX}expoll`,
  };

  function parse(data: RequestData, response: Message): Parsed {
    const mentinos = parseMentions(data);
    const question = parseQuestion(data, mentinos);
    const parsed: Parsed = {
      response : response,
      exclusive: data.prefix === prefixes.expoll,
      mentions : mentinos,
      author   : parseAuthor(data),
      image    : parseAttachment(data),
      question : question,
      choices  : parseChoices(data, question),
    };
    return parsed;
  }

  async function generate(
    data: RequestData, response: Message
  ): Promise<MessageEmbedOptions> {
    try {
      const parsed = parse(data, response);
      if (parsed.question) comparePermissions(data, parsed);

      await renderSelectors(data, parsed);
      return renderEmbed(data, parsed);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return renderError(error);
      throw error;
    }
  }

  function clearReactions(response: Message) {
    response.reactions.removeAll()
      .catch(console.error);
  }

  const respond: Responder = async (
    { request, prefix, args, response, lang }
  ) => {
    if (response)
      clearReactions(response);
    else
      response = await request.channel.send(Locales[lang].loadings.poll());

    return response.edit({
      embed: await generate({ request, prefix, args, response, lang }, response)
    });
  }

  export function initialize(): void {
    Allocater.responders.set(
      prefixes.poll,   data => respond(data)
    );
    Allocater.responders.set(
      prefixes.expoll, data => respond(data)
    );
  }
}
