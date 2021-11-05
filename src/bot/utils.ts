import { Client, ActivityType, Message, DiscordAPIError, PartialMessage } from 'discord.js';
import { COMMAND_PREFIX } from '../constants';
import { Health } from '../transactions/health';

export namespace Utils {
  export async function fetchMessage(message: Message | PartialMessage): Promise<Message | null> {
    try {
      return await message.fetch();
    }
    catch (error: unknown) {
      if (error instanceof DiscordAPIError) return null;
      throw error;
    }
  }

  export function removeMessageCache(message: Message): boolean {
    return message.channel.messages.cache.delete(message.id);
  }

  export function partingText(
    text: string, limit: number, prepend: string, append: string
  ): string[] {
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
  }

  function totalGuildCount(): string {
    const entire = Health.entire;

    return entire?.completed ? String(entire.totalGuildCount) : 'いくつかの';
  }

  export async function updatePresence(
    bot: Client<true>, count: number
  ): Promise<void> {
    let type: ActivityType, name: string;

    switch (count % 2) {
      case 1:
        type = 'COMPETING';
        name = `${totalGuildCount()} サーバー`;
        break;
  
      default:
        type = 'PLAYING';
        name = `${COMMAND_PREFIX}poll | ${COMMAND_PREFIX}expoll`;
        break;
    }

    bot.user?.setPresence({ status: 'online', activities: [{ type, name }] });
  }
}
