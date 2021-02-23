import { DMChannel, Message } from 'discord.js';

import { BOT_OWNER_IDS } from '../constants';
import { bot } from '../bot';
import { partingText } from '../utils';

function respondLog(channel: DMChannel, log: string): void {
  const logs = partingText(log, 2000, '```', '```');

  Promise.all(logs.map(channel.send))
    .catch(console.error);
}

function adminEval(message: Message): void {
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

function validate(message: Message): boolean {
  return BOT_OWNER_IDS.some(id => id === message.author.id);
}

function adminProcessing(message: Message): void {
  if (!validate(message)) return;

  adminEval(message);
}

bot.on('message', adminProcessing);
