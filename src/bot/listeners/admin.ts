import { Client, DMChannel, Message } from 'discord.js';

import { BOT_OWNER_IDS } from '../../constants';
import { Utils } from '../utils';

export const Admin: {
  initialize(bot: Client): void;

  processing(message: Message): void;
  validate(message: Message): boolean;
  eval(message: Message): void;
  respondLog(channel: DMChannel, log: string): void;
} = {
  initialize(bot) {
    bot.on('message', () => this.processing);
  },

  processing(message) {
    if (!this.validate(message)) return;
    this.eval(message);
  },
  validate(message) {
    return BOT_OWNER_IDS.some(id => id === message.author.id);
  },
  eval(message) {
    if (message.channel.type !== 'dm') return;

    const match = message.content.match(/^\/admin ```\n?(.+?)\n?```$/m);
    if (!match) return;

    let log: string;

    try {
      log = String(eval(match[1]));
    }
    catch (e) {
      if (e instanceof Error)
        log = e.stack ?? e.message;
      else
        log = String(e);
    }

    this.respondLog(message.channel, log);
  },
  respondLog(channel, log) {
    const logs = Utils.partingText(log, 2000, '```', '```');

    Promise.all(logs.map(channel.send))
      .catch(console.error);
  }
}
