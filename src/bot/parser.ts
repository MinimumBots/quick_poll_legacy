import { Message, PartialMessage } from 'discord.js';

import { bot } from './bot';
import { Dispatcher } from './dispatcher';
import { COMMAND_PREFIX, COMMAND_EDITABLE_TIME } from './constants';
import { removeMessageCache } from './utils';

class ParsingData {
  readonly quotePairs: { [quote: string]: string }
    = { '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’" };

  args: string[] = [];
  arg: string = '';
  quote: string = '';
  escape: boolean = false;

  addArg(force: boolean = false): string[] {
    if (this.arg || force) this.args.push(this.arg);
    this.arg = '';
    return this.args;
  }
}

export const Parser: {
  parseArgsLimit: number;
  quotePairs: { [quote: string]: string };

  parse(message: Message): void;
  reparse(_: Message | PartialMessage, message: Message | PartialMessage): void;
  accept(message: Message): boolean;

  split(content: string): string[];
  checkArgsLength(data: ParsingData): boolean;
  parseQuote(char: string, data: ParsingData): boolean;
  parseSpace(char: string, data: ParsingData): boolean;
  parseEscape(char: string, data: ParsingData): boolean;
} = {
  parseArgsLimit: 60,
  quotePairs: { '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’" },

  parse(message) {
    if (!this.accept(message)) {
      removeMessageCache(message);
      return;
    }

    const args = this.split(message.content);
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
    const data = new ParsingData();

    for(const char of [...content]) {
      if (!this.checkArgsLength(data)) break;
      if (this.parseQuote (char, data)) continue;
      if (this.parseSpace (char, data)) continue;
      if (this.parseEscape(char, data)) continue;
      data.arg += char;
    }

    return data.addArg();
  },
  checkArgsLength(data) {
    if (data.args.length <= this.parseArgsLimit) return true;

    data.args = [];
    return false;
  },
  parseQuote(char, data) {
    const ended = char === data.quote;

    if (data.escape || (data.quote || !data.quotePairs[char]) && !ended)
      return false;

    data.addArg(ended);
    data.quote = ended ? '' : data.quotePairs[char];
    return true;
  },
  parseSpace(char, data) {
    if (data.escape || data.quote || !/\s/.test(char)) return false;

    data.addArg();
    return true;
  },
  parseEscape(char, data) {
    return data.escape = !data.escape && char === '\\';
  }
};

bot.on('message', Parser.parse);
bot.on('messageUpdate', Parser.reparse);
