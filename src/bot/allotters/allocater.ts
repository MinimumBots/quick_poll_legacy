import { Client, Collection, Message, Snowflake } from 'discord.js';

import { DEBUG_MODE } from '../../constants';
import { Session } from './session';
import { Help } from '../responders/help';
import { Rejecter } from '../responders/rejecter';
import { Utils } from '../utils';
import { Preferences } from '../preferences';
import { Lang } from '../templates/locale';
import { Poll } from '../responders/poll';
import { Result } from '../responders/result';
import { Decrypter } from '../listeners/decrypter';

export interface RequestData {
  botID   : Snowflake,
  request : Message,
  header  : string,
  args    : string[],
  response: Message | null,
  lang    : Lang,
}

export type Header = string;
export type Responder = (data: RequestData) => Promise<Message | null>;

export namespace Allocater {
  export function initialize(bot: Client, botID: Snowflake): void {
    Help.initialize(bot, botID);
    Poll.initialize();
    Result.initialize();
  }

  type Responders = Collection<Header, Responder>;
  const responders: Responders = new Collection;

  export function entryResponder(
    header: Header, responder: Responder
  ): Responders {
    Decrypter.entryHeader(header);
    return responders.set(header, responder);
  }

  type CommandArgs = string[];

  export function submit(
    request: Message, header: Header, args: CommandArgs, botID: Snowflake
  ): void {
    const responder = responders.get(header);
    if (responder)
      respond(request, responder, header, args, botID)
        .catch(console.error);
  }

  async function respond(
    request: Message, responder: Responder,
    header: string, args: CommandArgs, botID: Snowflake
  ): Promise<void> {
    const session  = Session.get(request.id);
    const response = session?.response ?? null;
    const lang     = await Preferences.fetchLang(request.author, request.guild);

    try {
      const newResponse = await responder({
        botID, request, header, args, response, lang
      });
      if (!newResponse) return;

      allocate(request, newResponse, session);
    }
    catch (exception: unknown) {
      reject(exception, request);
    }
  }

  function reject(exception: unknown, request: Message): void {
    if (DEBUG_MODE) console.error(exception);

    Rejecter.issue(exception, request)
      .then(response => response && allocate(request, response))
      .catch(console.error);
  }

  function allocate(
    request: Message, response: Message | null, session?: Session.Data | null
  ): void {
    if (!response)
      Utils.removeMessageCache(request);
    else if (!session)
      Session.create(request, response);
  }
};
