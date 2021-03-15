import { Client, DMChannel, Message } from 'discord.js';

import { BOT_OWNER_IDS } from '../../constants';
import { Utils } from '../utils';

export namespace Admin {
  export function initialize(bot: Client): void {
    bot.on('message', message => processing(message));
  }

  function processing(message: Message): void {
    if (!validate(message)) return;
    evaluate(message);
  }

  function validate(message: Message): boolean {
    return BOT_OWNER_IDS.some(id => id === message.author.id);
  }

  function evaluate(message: Message): void {
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

    respondLog(message.channel, log);
  }

  function respondLog(channel: DMChannel, log: string): void {
    const logs = Utils.partingText(log, 2000, '```', '```');

    Promise.all(logs.map(channel.send))
      .catch(console.error);
  }
}
