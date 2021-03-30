import { basename, extname } from 'path';
import {
  DiscordAPIError,
  Guild,
  Message,
  Permissions,
  PermissionString,
} from 'discord.js';

import {
  COMMAND_MAX_CHOICES,
  COMMAND_PREFIX,
  COMMAND_QUESTION_MAX,
  POSTULATE_WEBHOOK_PERMISSIONS,
} from '../../constants';
import { Locales } from '../templates/locale';
import { Allocater, RequestChunk } from '../allotters/allocater';
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

  const pollPermissions: readonly PermissionString[] = [
    'ADD_REACTIONS', 'READ_MESSAGE_HISTORY'
  ];
  const exclusivePermissions: readonly PermissionString[] = [
    'MANAGE_MESSAGES'
  ];
  const externalPermissions: readonly PermissionString[] = [
    'USE_EXTERNAL_EMOJIS'
  ];
  const mentionPermissions: readonly PermissionString[] = [
    'MENTION_EVERYONE'
  ];
  const attachImagePermissions: readonly PermissionString[] = [
    'ATTACH_FILES'
  ];

  function sumRequireAuthoerPermissions(
    query: Query, permissions: Readonly<Permissions>
  ): readonly PermissionString[] {
    return query.mentions.length && permissions.has(mentionPermissions)
      ? mentionPermissions : [];
  }

  function sumRequireMyPermissions(query: Query): PermissionString[] {
    const permissions = pollPermissions.slice();

    if (query.exclusive) permissions.push(...exclusivePermissions);
    if (query.choices.some(choice => choice.external))
      permissions.push(...externalPermissions);
    if (query.imageURL) permissions.push(...attachImagePermissions);

    return permissions;
  }

  function validateAuthorPermissions(
    chunk: RequestChunk, query: Query,
    myPermissions: Readonly<Permissions>,
    authorPermissions: Readonly<Permissions>,
  ): void {
    const requirePermissions
      = sumRequireAuthoerPermissions(query, myPermissions);
    const missingPermissions = authorPermissions.missing(requirePermissions);
    if (missingPermissions.length)
      throw new CommandError(
        'lackYourPermissions', chunk.lang, missingPermissions
      );
  }

  function validateMyPermissions(
    chunk: RequestChunk, query: Query, permissions: Readonly<Permissions>
  ): void {
    const requirePermissions = sumRequireMyPermissions(query);
    const missingPermissions = permissions.missing(requirePermissions);
    if (missingPermissions.length)
      throw new CommandError(
        'lackPermissions', chunk.lang, missingPermissions
      );
  }

  function getAuthorPermissionsFor(
    request: Message
  ): Readonly<Permissions> | null {
    if (request.channel.type === 'dm') return null;
     
    if (request.webhookID)
      return new Permissions(POSTULATE_WEBHOOK_PERMISSIONS);
    else
      return request.channel.permissionsFor(request.author);
  }

  function validatePermissions(
    chunk: RequestChunk, query: Query
  ): boolean {
    const request = chunk.request;
    const channel = request.channel;
    if (channel.type === 'dm') return false;

    const myPermissions = channel.permissionsFor(chunk.botID);
    const authorPermissions = getAuthorPermissionsFor(request);
    if (!myPermissions || !authorPermissions) return false;

    validateMyPermissions(chunk, query, myPermissions);
    validateAuthorPermissions(chunk, query, myPermissions, authorPermissions);

    return true;
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

  function safePushChoiceEmoji(
    chunk: RequestChunk, emojis: string[], newEmoji: string
  ): number {
    if (emojis.includes(newEmoji))
      throw new CommandError('duplicateEmojis', chunk.lang);

    return emojis.push(newEmoji);
  }

  function safePushChoiceText(
    chunk: RequestChunk, texts: (string | null)[], newtext: string | null
  ): number {
    if (newtext && newtext.length > COMMAND_QUESTION_MAX)
      throw new CommandError('tooLongQuestion', chunk.lang);

    return texts.push(newtext);
  }

  function generateChoices(chunk: RequestChunk): Choice[] {
    const emojis: string[] = [], texts: (string | null)[] = [];
    let external = false;

    chunk.args.forEach(arg => {
      if (emojiRegex.test(arg)) {
        const length = safePushChoiceEmoji(chunk, emojis, arg);
        if (texts.length < length - 1) safePushChoiceText(chunk, texts, null);

        external ||= !isLocalGuildEmoji(chunk.request.guild, arg);
      }
      else {
        const length = safePushChoiceText(chunk, texts, arg);
        if (emojis.length < length)
          safePushChoiceEmoji(chunk, emojis, defaultEmojis[length - 1]);
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

  function parseChoices(chunk: RequestChunk): Choice[] {
    const choices
      = chunk.args.length ? generateChoices(chunk) : generateTwoChoices();

    if (choices.length > COMMAND_MAX_CHOICES)
      throw new CommandError('tooManyOptions', chunk.lang);

    return choices;
  }

  function parseQuestion(chunk: RequestChunk): string | null {
    return chunk.args.shift() ?? null;
  }

  function parseMentions(chunk: RequestChunk): string[] {
    const mentions: string[] = [];

    for (const arg of chunk.args) {
      const matchMention = arg.match(/^(@everyone|@here|<@&\d+>)$/);
      const matchEvery   = arg.match(/^(?!\\)(everyone|here)$/);
      const matchNumber  = arg.match(/^(?!\\)(\d+)$/);
      if (!matchMention && !matchEvery && !matchNumber) break;

      if (matchMention) mentions.push(matchMention[1]);
      if (matchEvery)   mentions.push(`@${matchEvery[1]}`);
      if (matchNumber)  mentions.push(`<@&${matchNumber[1]}>`);
    }

    mentions.forEach(() => chunk.args.shift());

    return mentions;
  }

  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  function parseAttachedImage(chunk: RequestChunk): string | null {
    return chunk.request.attachments.find(
      attachment => imageExtensions.includes(extname(attachment.url))
    )?.url ?? null;
  }

  function parseAuthor(chunk: RequestChunk): Author {
    const user = chunk.request.author;
    const member = chunk.request.member;

    return {
      iconURL: user.displayAvatarURL(),
      name: member?.displayName ?? user.username,
    };
  }

  function parse(chunk: RequestChunk, exclusive: boolean): Query {
    const query = {
      exclusive: exclusive,
      author   : parseAuthor(chunk),
      imageURL : parseAttachedImage(chunk),
      mentions : parseMentions(chunk),
      question : parseQuestion(chunk),
      choices  : parseChoices(chunk),
    };

    if (query.mentions.length && query.question === null)
      throw new CommandError('ungivenQuestion', chunk.lang);

    return query;
  }

  function respondError(
    chunk: RequestChunk, error: CommandError
  ): Promise<Message> {
    const options = { embed: error.embed };
    const channel = chunk.request.channel;
    const response = chunk.response;

    return response ? response.edit(options) : channel.send(options);
  }

  function respondPoll(
    chunk: RequestChunk, query: Query, response: Message
  ): Promise<Message> {
    const choices = query.choices;
    const selectors: string[] = choices.some(choice => choice.text !== null)
      ? choices.map(choice => choice.emoji) : [];

    return response.edit(
      query.mentions.join(' '),
      {
        embed: Locales[chunk.lang].successes.poll(
          query.exclusive,
          query.author.iconURL,
          query.author.name,
          query.question ?? '',
          selectors,
          choices.map(choice => choice.text ?? ''),
          query.imageURL ? basename(query.imageURL) : null,
          response.channel.id,
          response.id,
        )
      }
    );
  }

  async function attachSelectors(
    chunk: RequestChunk, query: Query, response: Message
  ): Promise<void> {
    try {
      await Promise.all(
        query.choices.map(choice => response.react(choice.emoji))
      );
    }
    catch (exception: unknown) {
      if (exception instanceof DiscordAPIError)
        if (exception.httpStatus === 400)
          throw new CommandError('unusableEmoji', chunk.lang);
    }
  }

  function respondLoading(chunk: RequestChunk, query: Query): Promise<Message> {
    return chunk.request.channel.send(
      query.mentions.join(' '),
      {
        embed: Locales[chunk.lang].loadings.poll(query.exclusive),
        files: query.imageURL ? [query.imageURL] : [],
      }
    );
  }

  function respondHelp(chunk: RequestChunk): Promise<Message> {
    const options = { content: '', embed: Help.getEmbed(chunk.lang) };
    const channel = chunk.request.channel;
    const response = chunk.response;

    return response ? response.edit(options) : channel.send(options);
  }

  function clearSelectors(response: Message): void {
    response.reactions.removeAll()
      .catch(() => undefined);
  }

  async function respond(
    chunk: RequestChunk, exclusive: boolean
  ): Promise<Message | null> {
    if (chunk.response) clearSelectors(chunk.response);
    if (!chunk.args.length) return respondHelp(chunk);

    try {
      const query = parse(chunk, exclusive);
      if (!validatePermissions(chunk, query)) return null;

      chunk.response ??= await respondLoading(chunk, query);
      await attachSelectors(chunk, query, chunk.response);
      return respondPoll(chunk, query, chunk.response);
    }
    catch (error: unknown) {
      if (error instanceof CommandError) return respondError(chunk, error);
      throw error;
    }
  }
  
  export function initialize(): void {
    Allocater.entryResponder(
      `${COMMAND_PREFIX}poll`,   chunk => respond(chunk, false)
    );
    Allocater.entryResponder(
      `${COMMAND_PREFIX}expoll`, chunk => respond(chunk, true)
    );
  }
}
