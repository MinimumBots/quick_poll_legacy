import {
  Client,
  Message,
  MessageReaction,
  PartialUser,
  Snowflake,
  User,
} from 'discord.js';
import { COMMAND_EDITABLE_TIME } from '../../constants';
import { Utils } from '../utils';

export namespace Session {
  export function initialize(bot: Client): void {
    bot.on('messageReactionAdd', (reaction, user) => validate(reaction, user));
  }

  export interface Data {
    readonly bot     : Client,
    readonly id      : Snowflake,
    readonly user    : User,
    readonly request : Message,
    readonly response: Message,
    readonly timeout : NodeJS.Timeout,
  }

  const sessions: Map<Snowflake, Data> = new Map;
  const cancelEmoji = '↩️';

  function validate(reaction: MessageReaction, user: User | PartialUser): void {
    const data = sessions.get(reaction.message.id);
    if (!data) return;

    if (reaction.emoji.name === cancelEmoji && user.id === data.user.id)
      cancel(data.id);
  }

  export function get(id: Snowflake): Data | null {
    return sessions.get(id) ?? null;
  }

  export function create(request: Message, response: Message): Data {
    const id = request.id;
    const data: Data = {
      bot     : request.client,
      id      : id,
      user    : request.author,
      request : request,
      response: response,
      timeout : request.client.setTimeout(
        () => close(id), COMMAND_EDITABLE_TIME
      ),
    }

    sessions.set(id, data);
    return data;
  }

  function cancel(id: Snowflake): void {
    const data = sessions.get(id);
    if (!data) return;

    data.bot.clearTimeout(data.timeout);
    data.response.delete()
      .catch(() => undefined);

    close(id);
  }

  function close(id: Snowflake): void {
    const data = sessions.get(id);
    if (!data) return;

    data.request.reactions.cache.get(cancelEmoji)?.users.remove()
      .catch(() => undefined);

    Utils.removeMessageCache(data.request);
  }
}
