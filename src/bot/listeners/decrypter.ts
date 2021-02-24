import { Guild, Message, PartialMessage, User } from 'discord.js';

import {
  COMMAND_PREFIX,
  COMMAND_EDITABLE_TIME,
  USER_RATE_LIMIT,
  BOT_RATE_LIMIT,
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
  overRate(user: User, guild: Guild | null): boolean;

  parse(content: string): string[];
} = {
  userRateLimits: new RateLimits(USER_RATE_LIMIT),
  botRateLimits : new RateLimits(BOT_RATE_LIMIT),

  decrypt(message) {
    if (!this.accept(message)) {
      removeMessageCache(message);
      return;
    }

    const args = this.parse(message.content);
    Allocater.submit(message, args[0], args.slice(1));
  },
  redecrypt(_, message) {
    if (Date.now() - message.createdTimestamp > COMMAND_EDITABLE_TIME) return;

    message.fetch()
      .then(this.decrypt)
      .catch(console.error);
  },

  accept(message) {
    return (
      message.type === 'DEFAULT'
      && message.content.startsWith(COMMAND_PREFIX)
      && !this.overRate(message.author, message.guild)
    );
  },
  overRate(user, guild) {
    if (user.bot)
      return guild ? !this.botRateLimits.addition(guild.id) : true;
    else
      return !this.userRateLimits.addition(user.id);
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
