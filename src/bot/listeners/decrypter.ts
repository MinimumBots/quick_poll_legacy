import { Guild, Message, PartialMessage, User } from 'discord.js';

import {
  USABLE_CHANNEL_TYPES,
  USER_RATE_LIMIT,
  BOT_RATE_LIMIT,
  COMMAND_EDITABLE_TIME,
  COMMAND_PREFIX,
  MINIMUM_BOT_PERMISSIONS,
} from '../constants';

import { bot } from '../bot';
import { removeMessageCache } from '../utils';

import RateLimits from '../allotters/ratelimits';
import { Allocater } from '../allotters/allocater';
import Parsing from './parsing';

export const Decrypter: {
  readonly userRateLimits: RateLimits;
  readonly botRateLimits : RateLimits;

  decrypt(message: Message): void;
  redecrypt(_: any, message: Message | PartialMessage): void;

  accept(message: Message): boolean;
  isMatch(message: Message): boolean;
  hasPermissions(channel: USABLE_CHANNEL_TYPES): boolean;
  isUnderRate(user: User, guild: Guild | null): boolean;

  parse(content: string): string[];
} = {
  userRateLimits: new RateLimits(USER_RATE_LIMIT),
  botRateLimits : new RateLimits(BOT_RATE_LIMIT),

  decrypt(message) {
    if (this.accept(message)) {
      const args = this.parse(message.content);
      Allocater.submit(message, args[0], args.slice(1));
    }
    else
      removeMessageCache(message);
  },
  redecrypt(_, message) {
    if (Date.now() - message.createdTimestamp > COMMAND_EDITABLE_TIME) return;

    message.fetch()
      .then(this.decrypt)
      .catch(console.error);
  },

  accept(message) {
    return (
      this.isMatch(message)
      && this.hasPermissions(message.channel)
      && this.isUnderRate(message.author, message.guild)
    );
  },
  isMatch(message) {
    return (
      message.type === 'DEFAULT'
      && message.content.startsWith(COMMAND_PREFIX)
    );
  },
  hasPermissions(channel) {
    return !!(
      channel.type === 'dm'
      || bot.user
      && channel.permissionsFor(bot.user)?.any(MINIMUM_BOT_PERMISSIONS)
    );
  },
  isUnderRate(user, guild) {
    if (user.bot)
      return guild ? this.botRateLimits.addition(guild.id) : false;
    else
      return this.userRateLimits.addition(user.id);
  },

  parse(content) {
    const parsing = new Parsing;

    for(const char of [...content]) {
      if (parsing.parseSyntax(char)) continue;
      if (parsing.overLength()) break;
      parsing.addCharacter(char);
    }

    return parsing.pushChunk();
  }
};

bot.on('message', Decrypter.decrypt);
bot.on('messageUpdate', Decrypter.redecrypt);
