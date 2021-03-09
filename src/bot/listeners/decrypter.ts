import { Client, Guild, Message, PartialMessage, User } from 'discord.js';

import {
  USABLE_CHANNEL,
  USER_RATE_LIMIT,
  BOT_RATE_LIMIT,
  COMMAND_EDITABLE_TIME,
  COMMAND_PREFIX,
  MINIMUM_BOT_PERMISSIONS,
} from '../../constants';

import { Utils } from '../utils';

import RateLimits from '../allotters/ratelimits';
import { Allocater } from '../allotters/allocater';
import Splitter from './splitter';

export namespace Decrypter {
  function split(content: string): string[] {
    const splitter = new Splitter;

    for(const char of [...content]) {
      if (splitter.parseSyntax(char)) continue;
      if (splitter.overLength()) break;
      splitter.addCharacter(char);
    }

    return splitter.pushChunk();
  }

  const userRateLimits = new RateLimits(USER_RATE_LIMIT);
  const botRateLimits  = new RateLimits(BOT_RATE_LIMIT);

  function isUnderRate(user: User, guild: Guild | null): boolean {
    if (user.bot)
      return guild ? botRateLimits.addition(guild.id) : false;
    else
      return userRateLimits.addition(user.id);
  }

  function hasPermissions(channel: USABLE_CHANNEL): boolean {
    const bot = channel.client;

    return !!(
      channel.type === 'dm'
      || bot.user
      && channel.permissionsFor(bot.user)?.any(MINIMUM_BOT_PERMISSIONS)
    );
  }

  function isMatch(message: Message): boolean {
    const content = message.content;

    return (
      message.type === 'DEFAULT'
      && (content.startsWith(COMMAND_PREFIX) || content.startsWith('<@'))
    );
  }

  function accept(message: Message): boolean {
    return (
      isMatch(message)
      && hasPermissions(message.channel)
      && isUnderRate(message.author, message.guild)
    );
  }

  function decrypt(message: Message): void {
    if (accept(message)) {
      const args = split(message.content);
      Allocater.submit(message, args[0], args.slice(1));
    }
    else
      Utils.removeMessageCache(message);
  }

  function redecrypt(message: Message | PartialMessage): void {
    if (Date.now() - message.createdTimestamp > COMMAND_EDITABLE_TIME) return;

    message.fetch()
      .then(message => decrypt(message))
      .catch(console.error);
  }

  export function initialize(bot: Client): void {
    bot.on('message', message => decrypt(message));
    bot.on('messageUpdate', (_, message) => redecrypt(message));
  }
}
