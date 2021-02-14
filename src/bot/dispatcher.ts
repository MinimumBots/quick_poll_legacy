import { Collection, Message, Snowflake } from 'discord.js';

import { UsersRateLimit, BotsRateLimit, WebhooksRateLimit } from './ratelimits';
import Session from './session';

export type Responder = (request: Message, args: string[]) => Promise<Message>;
export type CommandArgs = string[];

export const Dispatcher: {
  readonly responders: Collection<string, Responder>;
  readonly sessions  : Collection<Snowflake, Session>;

  addResponder(prefix: string, responder: Responder): Collection<string, Responder>;

  submit(request: Message, prefix: string, args: CommandArgs): void;
  accept(request: Message): boolean;
  execute(request: Message, responder: Responder, args: CommandArgs): void;

  dispatch(request: Message, response: Message): void;
  free(requestID: Snowflake): void;
} = {
  responders: new Collection,
  sessions  : new Collection,

  addResponder(prefix, responder) {
    return this.responders.set(prefix, responder);
  },

  submit(request, prefix, args) {
    if (!this.accept(request)) {
      request.channel.messages.cache.delete(request.id);
      return;
    }

    const responder = this.responders.get(prefix);
    if (responder) this.execute(request, responder, args);
  },
  accept(request) {
    const user  = request.author;
    const guild = request.guild;

    if (user.bot) {
      if (guild) {
        if (request.webhookID) return !!WebhooksRateLimit.addition(guild.id);
        else return !!BotsRateLimit.addition(user.id, guild.id);
      }
      else return false;
    }
    else return !!UsersRateLimit.addition(user.id);
  },
  execute(request, responder, args) {
    responder(request, args)
      .then(response => this.dispatch(request, response))
      .catch(console.error);
  },

  dispatch(request, response) {
    let session = this.sessions.get(request.id);

    if (session) session.update(response);
    else session = new Session(request, response, this.free);

    this.sessions.set(request.id, session);
  },
  free(requestID) {
    this.sessions.delete(requestID);
  },
};
