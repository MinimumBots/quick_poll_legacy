import { Client, ActivityType, Message } from 'discord.js';

export const Utils: {
  removeMessageCache(message: Message): boolean;
  partingText(
    text: string, limit: number, prepend: string, append: string
  ): string[];
  fetchGuildCount(bot: Client): Promise<string>;
  updatePresence(bot: Client, count: number): Promise<void>;
} = {
  removeMessageCache(message) {
    return message.channel.messages.cache.delete(message.id);
  },
  partingText(text, limit, prepend, append) {
    const texts: string[] = [];
    let part: string = prepend;

    for (const line of text.split('\n')) {
      if (line.length > limit)
        throw new RangeError(
          `The number of characters per line exceeds the limit of ${limit}.`
        );

      if (part.length + line.length > limit - append.length) {
        texts.push(`${part}\n${append}`);
        part = prepend;
      }
      part += `\n${line}`;
    }

    return texts.concat(`${part}\n${append}`);
  },
  async fetchGuildCount(bot) {
    const counts = await bot.shard?.fetchClientValues('guilds.cache.size');
    const count = counts?.reduce((a, b) => a + b, 0);
    return typeof count === 'number' && count > 0 ? `${count}` : 'いくつかの';
  },
  async updatePresence(bot, count) {
    let type: ActivityType, name: string;

    switch (count % 2) {
      case 1:
        type = 'WATCHING';
        name = `${await this.fetchGuildCount(bot)} サーバー`;
        break;
  
      default:
        type = 'PLAYING';
        name = '/poll | /expoll';
        break;
    }
  
    await bot.user?.setPresence({ status: 'online', activity: { type, name } });
  }
};
