import { Message } from 'discord.js';

export function removeMessageCache(message: Message): boolean {
  return message.channel.messages.cache.delete(message.id);
}

export function partingText(
  text: string, limit: number, prepend = '', append = ''
): string[] {
  const texts: string[] = [];
  let part: string = prepend;

  for (const line of text.split('\n')) {
    if (part.length + line.length > limit - append.length) {
      texts.push(part + append);
      part = prepend;
    }
    part += line;
  }

  return texts.concat(part + append);
}
