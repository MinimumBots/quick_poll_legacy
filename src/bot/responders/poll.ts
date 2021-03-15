import { basename, extname } from 'path';
import {
  DiscordAPIError,
  Guild,
  Message,
  Permissions,
  PermissionString,
} from 'discord.js';

import { ASSUMING_DM_PERMISSIONS, COMMAND_PREFIX } from '../../constants';
import { Locales } from '../templates/locale';
import { Allocater, RequestData } from '../allotters/allocater';
import CommandError from './error';
import { Help } from './help';

export namespace Poll {
  type Choice = { emoji: string, text: string | null, external: boolean };
  type Author = { iconURL: string, name: string };

  interface Query {
    exclusive: boolean,
    author   : Author,
    imageURL : string | null,
    mentions : string[],
    question : string | null;
    choices  : Choice[],
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
  const attachImagePermissions: PermissionString[] = [
    'ATTACH_FILES'
  ];

  function sumRequireAuthoerPermissions(
    query: Query, permissions: Readonly<Permissions>
  ): PermissionString[] {
    return query.mentions.length && permissions.has(mentionPermissions)
      ? mentionPermissions : [];
  }

  function sumRequireMyPermissions(query: Query): PermissionString[] {
    const permissions = pollPermissions;

    if (query.exclusive) permissions.push(...exclusivePermissions);
    if (query.choices.some(choice => choice.external))
      permissions.push(...externalPermissions);
    if (query.imageURL) permissions.push(...attachImagePermissions);

    return permissions;
  }

  function validateAuthorPermissions(
    data: RequestData, query: Query, permissions: Readonly<Permissions>
  ): boolean {
    const requirePermissions = sumRequireAuthoerPermissions(query, permissions);
    const missingPermissions = permissions.missing(requirePermissions);
    if (missingPermissions.length)
      throw new CommandError(
        'lackYourPermissions', data.lang, missingPermissions
      );

    return true;
  }

  function validateMyPermissions(
    data: RequestData, query: Query, permissions: Readonly<Permissions>
  ): boolean {
    const requirePermissions = sumRequireMyPermissions(query);
    const missingPermissions = permissions.missing(requirePermissions);
    if (missingPermissions.length)
      throw new CommandError(
        'lackPermissions', data.lang, missingPermissions
      );

    return true;
  }

  function validatePermissions(
    data: RequestData, query: Query
  ): boolean {
    const request = data.request;
    const channel = request.channel;

    const myPermissions = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(data.botID);
    const authorPermissions = channel.type === 'dm'
      ? new Permissions(ASSUMING_DM_PERMISSIONS)
      : channel.permissionsFor(request.author);
    if (!myPermissions || !authorPermissions) return false;

    return (
      validateMyPermissions(data, query, myPermissions)
      && validateAuthorPermissions(data, query, authorPermissions)
    );
  }

  function isLocalGuildEmoji(guild: Guild | null, emoji: string): boolean {
    const match = emoji.match(/^<a?:.+?:(\d+)>$/);
    return guild && match ? guild.emojis.cache.has(match[1]) : false;
  }

  const defaultEmojis = [
    '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲',
    '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',
  ];
  const twemojiRegex
    = require('twemoji-parser/dist/lib/regex.js').default as RegExp;
  const emojiRegex
    = new RegExp(`^(${twemojiRegex.toString().slice(1, -2)}|<a?:.+?:\\d+>)$`);

  const twoChoiceEmojis = ['⭕', '❌'];

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

  function generateTwoChoices(): Choice[] {
    return twoChoiceEmojis.map(emoji => (
      { emoji: emoji, text: null, external: false }
    ));
  }

  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  function parseChoices(data: RequestData): Choice[] {
    if (!data.args.length) return generateTwoChoices();
    return generateChoices(data);
  }

  function parseQuestion(data: RequestData): string | null {
    return data.args.shift() ?? null;
  }

  function parseMentions(data: RequestData): string[] {
    const mentions: string[] = [];

    for (const arg of data.args) {
      const matchMention = arg.match(/^(@everyone|@here|<@&\d+>)$/);
      const matchEvery   = arg.match(/^(?!\\)(everyone|here)$/);
      const matchNumber  = arg.match(/^(?!\\)(\d+)$/);
      if (!matchMention && !matchEvery && !matchNumber) break;

      if (matchMention) mentions.push(matchMention[1]);
      if (matchEvery)   mentions.push(`@${matchEvery[1]}`);
      if (matchNumber)  mentions.push(`<@&${matchNumber[1]}>`);
    }

    mentions.forEach(() => data.args.shift());

    return mentions;
  }

  function parseAttachedImage(data: RequestData): string | null {
    return data.request.attachments.find(
      attachment => imageExtensions.includes(extname(attachment.url))
    )?.url ?? null;
  }

  function parseAuthor(data: RequestData): Author {
    const user = data.request.author;
    const member = data.request.member;

    return {
      iconURL: user.displayAvatarURL(),
      name: member?.displayName ?? user.username,
    };
  }

  function parse(data: RequestData, exclusive: boolean): Query {
    const query = {
      exclusive: exclusive,
      author   : parseAuthor(data),
      imageURL : parseAttachedImage(data),
      mentions : parseMentions(data),
      question : parseQuestion(data),
      choices  : parseChoices(data),
    };

    if (query.mentions.length && query.question === null)
      throw new CommandError('ungivenQuestion', data.lang);

    return query;
  }

  function respondError(
    data: RequestData, error: CommandError
  ): Promise<Message> {
    const options = { embed: error.embed };
    const channel = data.request.channel;
    const response = data.response;

    return response ? response.edit(options) : channel.send(options);
  }

  function respondPoll(
    data: RequestData, query: Query, response: Message
  ): Promise<Message> {
    const choices = query.choices;
    const selectors: string[] = choices.some(choice => choice.text !== null)
      ? choices.map(choice => choice.emoji) : [];

    return response.edit(
      query.mentions.join(' '),
      {
        embed: Locales[data.lang].successes.poll(
          query.exclusive,
          query.author.iconURL,
          query.author.name,
          query.question ?? '',
          selectors,
          choices.map(choice => choice.text ?? ''),
          query.imageURL ? basename(query.imageURL) : null,
          response.id,
        )
      }
    );
  }

  async function attachSelectors(
    data: RequestData, query: Query, response: Message
  ): Promise<void> {
    try {
      await Promise.all(
        query.choices.map(choice => response.react(choice.emoji))
      );
    }
    catch (exception: unknown) {
      if (exception instanceof DiscordAPIError)
        if (exception.httpStatus === 400)
          throw new CommandError('unusableEmoji', data.lang);
    }
  }

  function respondLoading(data: RequestData, query: Query): Promise<Message> {
    return data.request.channel.send(
      query.mentions.join(' '),
      { embed: Locales[data.lang].loadings.poll() }
    );
  }

  function respondHelp(data: RequestData): Promise<Message> {
    const options = { content: '', embed: Help.getEmbed(data.lang) };
    const channel = data.request.channel;
    const response = data.response;

    return response ? response.edit(options) : channel.send(options);
  }

  function clearSelectors(response: Message): void {
    response.reactions.removeAll()
      .catch(() => undefined);
  }

  async function respond(
    data: RequestData, exclusive: boolean
  ): Promise<Message | null> {
    if (data.response) clearSelectors(data.response);
    if (!data.args.length) return respondHelp(data);

    try {
      const query = parse(data, exclusive);
      if (!validatePermissions(data, query)) return null;

      data.response ??= await respondLoading(data, query);
      await attachSelectors(data, query, data.response);
      return respondPoll(data, query, data.response);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return respondError(data, error);
      throw error;
    }
  }
  
  export function initialize(): void {
    Allocater.responders.set(
      `${COMMAND_PREFIX}poll`,   data => respond(data, false)
    );
    Allocater.responders.set(
      `${COMMAND_PREFIX}expoll`, data => respond(data, true)
    );
  }
}
