import { Collection, Message, Snowflake } from 'discord.js';

import Session from './session';

export type Responder
  = (request: Message, args: string[], response?: Message) => Promise<Message>;
export type CommandArgs = string[];

export const Dispatcher: {
  readonly responders: Collection<string, Responder>;
  readonly sessions  : Collection<Snowflake, Session>;

  submit(request: Message, prefix: string, args: CommandArgs): void;
  respond(request: Message, responder: Responder, args: CommandArgs): void;

  dispatch(request: Message, response: Message, session?: Session): void;
  free(requestID: Snowflake): void;
} = {
  responders: new Collection,
  sessions  : new Collection,

  submit(request, prefix, args) {
    const responder = this.responders.get(prefix);
    if (responder) this.respond(request, responder, args);
  },
  respond(request, responder, args) {
    const session = this.sessions.get(request.id);
    const response = session?.response;

    responder(request, args, response)
      .then(response => this.dispatch(request, response, session))
      .catch(console.error);
  },

  dispatch(request, response, session) {
    if (session) this.sessions.set(
      request.id,
      new Session(request, response, this.free)
    );
  },
  free(requestID) {
    this.sessions.delete(requestID);
  }
};
