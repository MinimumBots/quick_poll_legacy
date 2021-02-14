import { Message, PartialMessage } from 'discord.js';

import { bot } from './bot';
import { Dispatcher } from './dispatcher';
import { COMMAND_PREFIX, COMMAND_EDITABLE_TIME } from './constants';

export const Parser: {
  quotePairs: { [quote: string]: string };

  parse(message: Message): void;
  reparse(_: Message | PartialMessage, message: Message | PartialMessage): void;
  accept(message: Message): boolean;
  split(content: string): string[];
} = {
  quotePairs: { '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’" },

  parse(message) {
    if (!this.accept(message)) return;

    const args = this.split(message.content.slice(1));
    Dispatcher.submit(message, args[0], args.slice(1));
  },
  reparse(_, message) {
    if (Date.now() - message.createdTimestamp > COMMAND_EDITABLE_TIME) return;

    message.fetch()
      .then(this.parse)
      .catch(console.error);
  },
  accept(message) {
    return message.type !== 'DEFAULT'
      || message.content.startsWith(COMMAND_PREFIX);
  },
  split(content) {
    const args: string[] = [];
    let arg = '';
    let quote = '';
    let escape = false;

    for (const char of [...content]) {
      if (!escape && (!quote && this.quotePairs[char]) || char === quote) {
        if (char === quote) {
          args.push(arg);
          quote = '';
        }
        else {
          if (arg) args.push(arg);
          quote = this.quotePairs[char];
        }

        arg = '';
        continue;
      }

      if (!escape && !quote && /\s/.test(char)) {
        if (arg) args.push(arg);
        arg = '';
        continue;
      }

      escape = !escape && char === '\\';
      if (escape) continue;

      arg += char;
    }

    if (arg) args.push(arg);
    return args;
  }
};

bot.on('message', Parser.parse);
bot.on('messageUpdate', Parser.reparse);
