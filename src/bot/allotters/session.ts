import {
  Client,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Snowflake,
  User,
} from 'discord.js';
import { COMMAND_EDITABLE_TIME } from '../../constants';
import { Utils } from '../utils';

export namespace Session {
  export function initialize(bot: Client<true>): void {
    bot.on('messageReactionAdd', (reaction, user) => { validate(reaction, user) });
  }

  export interface Data {
    readonly bot     : Client<true>,
    readonly id      : Snowflake,
    readonly user    : User,
    readonly request : Message<true>,
    readonly response: Message<true>,
    readonly timeout : NodeJS.Timeout,
  }

  const sessions: Map<Snowflake, Data> = new Map;
  const cancelEmoji = '↩️';

  function validate(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser): void {
    const data = sessions.get(reaction.message.id);
    if (!data) return;

    if (reaction.emoji.name === cancelEmoji && user.id === data.user.id)
      cancel(data.id);
  }

  export function get(id: Snowflake): Data | null {
    return sessions.get(id) ?? null;
  }

  export function create(request: Message<true>, response: Message<true>): Data {
    const id = request.id;
    const data: Data = {
      bot     : request.client,
      id      : id,
      user    : request.author,
      request : request,
      response: response,
      timeout : setTimeout(() => close(id), COMMAND_EDITABLE_TIME),
    }

    sessions.set(id, data);

    request.react(cancelEmoji)
      .catch(() => undefined);

    return data;
  }

  function cancel(id: Snowflake): void {
    const data = sessions.get(id);
    if (!data) return;

    clearTimeout(data.timeout);
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
