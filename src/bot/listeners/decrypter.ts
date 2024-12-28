import {
  Client,
  Guild,
  GuildTextBasedChannel,
  Message,
  MessageType,
  PartialMessage,
  Snowflake,
  User
} from 'discord.js';

import {
  USER_RATE_LIMIT,
  BOT_RATE_LIMIT,
  COMMAND_EDITABLE_TIME,
  MINIMUM_BOT_PERMISSIONS,
  GUILD_RATE_LIMIT,
} from '../../constants';

import { Utils } from '../utils';

import RateLimits from '../allotters/ratelimits';
import { Header, Allocater } from '../allotters/allocater';
import Splitter from './splitter';

export namespace Decrypter {
  export function initialize(bot: Client<true>): void {
    bot
      .on('messageCreate', message => { decrypt(message, bot.user.id) })
      .on('messageUpdate', (_, message) => { redecrypt(message, bot.user.id) });
  }

  const headers: Header[] = [];

  export function entryHeader(header: Header): void {
    headers.push(header);
  }

  function decrypt(message: Message, botID: Snowflake): void {
    if (accept(message, botID)) {
      const args = split(message.content);
      Allocater.submit(message, args[0], args.slice(1), botID);
    }
    else
      Utils.removeMessageCache(message);
  }

  function redecrypt(
    message: Message | PartialMessage, botID: Snowflake
  ): void {
    if (
      Date.now() - message.createdTimestamp > COMMAND_EDITABLE_TIME
      || !message.editedTimestamp
    ) return;

    message.fetch()
      .then(message => decrypt(message, botID))
      .catch(() => undefined);
  }

  function accept(message: Message, botID: Snowflake): message is Message<true> {
    return (
      message.inGuild()
      && isMatch(message)
      && hasPermissions(message.channel, botID)
      && isUnderRate(message.author, message.guild)
    );
  }

  function isMatch(message: Message<true>): boolean {
    return (
      message.type === MessageType.Default
      && headers.some(header => message.content.startsWith(header))
    );
  }

  function hasPermissions(channel: GuildTextBasedChannel, botID: Snowflake): boolean {
    return !!(channel.permissionsFor(botID)?.any(MINIMUM_BOT_PERMISSIONS));
  }

  const guildRateLimits = new RateLimits(GUILD_RATE_LIMIT);
  const userRateLimits = new RateLimits(USER_RATE_LIMIT);
  const botRateLimits  = new RateLimits(BOT_RATE_LIMIT);

  function isUnderRate(user: User, guild: Guild | null): boolean {
    return !!(guild
      && (user.bot ? botRateLimits.addition(guild.id) : userRateLimits.addition(user.id))
      && guildRateLimits.addition(guild.id));
  }

  function split(content: string): string[] {
    const splitter = new Splitter;

    for(const char of [...content]) {
      if (splitter.parseSyntax(char)) continue;
      if (splitter.overLength()) break;
      splitter.addCharacter(char);
    }

    return splitter.pushChunk();
  }
}
