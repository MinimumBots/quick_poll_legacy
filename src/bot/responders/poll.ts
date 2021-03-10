import {
  Collection,
  Channel,
  Permissions,
  MessageEmbedOptions,
  Snowflake,
  HTTPError,
  PermissionString,
  Guild,
  Message,
  ClientUser,
} from 'discord.js';

import {
  ASSUMING_DM_PERMISSIONS,
  COMMAND_PREFIX,
  MINIMUM_BOT_PERMISSIONS,
  USABLE_CHANNEL,
} from '../../constants';
import { Locales } from '../templates/locale';
import { Allocater, RequestData, Responder } from '../allotters/allocater';
import CommandError from './error';
import { Help } from './help';

export namespace Poll {
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
    if (!parsed.question) return Help.getEmbed(data.lang);

    const choices = parsed.choices;
    const selectors: string[] = choices.some(choice => choice.text !== null)
      ? choices.map(choice => choice.emoji) : [];

    return Locales[data.lang].successes.poll(
      parsed.author.iconURL,
      parsed.author.name,
      parsed.question,
      selectors,
      choices.map(choice => choice.text ?? ''),
      parsed.response.id,
    );
  }

  async function renderSelectors(
    data: RequestData, parsed: Parsed
  ): Promise<void> {
    try {
      await Promise.all(
        parsed.choices.map(choice => parsed.response.react(choice.emoji))
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
  const exclusivePermissions: PermissionString[] = [
    'MANAGE_MESSAGES'
  ];
  const externalPermissions: PermissionString[] = [
    'USE_EXTERNAL_EMOJIS'
  ];
  const mentionPermissions: PermissionString[] = [
    'MENTION_EVERYONE'
  ];

  function sumRequireAuthoerPermissions(
    parsed: Parsed, permissions: Readonly<Permissions>
  ): PermissionString[] {
    return parsed.mentions.length && permissions.has(mentionPermissions)
      ? mentionPermissions : [];
  }

  function sumRequireMyPermissions(parsed: Parsed): PermissionString[] {
    const permissions = MINIMUM_BOT_PERMISSIONS;
    permissions.push(...pollPermissions);
    if (parsed.exclusive) permissions.push(...exclusivePermissions);
    if (parsed.choices.some(choice => choice.external))
      permissions.push(...externalPermissions);
    return permissions;
  }

  function validateAuthorPermissions(
    data: RequestData, parsed: Parsed, permissions: Readonly<Permissions>
  ): boolean {
    const requirePermissions = sumRequireAuthoerPermissions(parsed, permissions);
    const missingPermissions = permissions.missing(requirePermissions);
    if (missingPermissions)
      throw new CommandError(
        'lackYourPermissions', data.lang, missingPermissions
      );

    return true;
  }

  function validateMyPermissions(
    data: RequestData, parsed: Parsed, permissions: Readonly<Permissions>
  ): boolean {
    const requirePermissions = sumRequireMyPermissions(parsed);
    const missingPermissions = permissions.missing(requirePermissions);
    if (missingPermissions)
      throw new CommandError(
        'lackPermissions', data.lang, missingPermissions
      );

    return true;
  }

  function validatePermissions(data: RequestData, parsed: Parsed): boolean {
    const request = data.request;
    const channel = parsed.response.channel;
    const botUser = request.client.user;
    if (!botUser) return false;

    const myPermissions = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(botUser);
    const authorPermissions = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(request.author);
    if (!myPermissions || !authorPermissions) return false;

    return (
      validateMyPermissions(data, parsed, myPermissions)
      && validateAuthorPermissions(data, parsed, authorPermissions)
    );
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
      if (mentions.length) throw new CommandError('ungivenQuestion', data.lang);
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
  ): Promise<MessageEmbedOptions | null> {
    try {
      const parsed = parse(data, response);
      if (parsed.question)
        if (validatePermissions(data, parsed)) return null;

      await renderSelectors(data, parsed);
      return renderEmbed(data, parsed);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return error.embed;
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

    const embed = await generate({ request, prefix, args, response, lang }, response);
    if (!embed) return null;

    return response.edit({ embed });
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
