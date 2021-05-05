import { IncomingMessage } from 'http';
import https from 'https';

import { Client } from 'discord.js';

import {
  FAMILY_PASS_PHRASE,
  PRESENCE_UPDATE_INTERVAL,
  TRANSACTION_API_ENDPOINT,
} from '../constants';

export namespace Health {
  interface CommonStatus {
    shardID   : number;
    wsStatus  : number;
    guildCount: number;
    userCount : number;
  }

  interface RegisterStatus extends CommonStatus {
    lastUpdateTimestamp: number;
  }

  interface ShardStatus extends CommonStatus {
    shardCount: number;
  }

  interface ReceiveStatus {
    completed      : boolean;
    updateSpan     : number;
    totalGuildCount: number;
    totalUserCount : number;
    statuses       : { [key: number]: RegisterStatus };
  }

  export function initialize(bot: Client): void {
    postStatus(bot);
  }

  export let entire: ReceiveStatus | null = null;

  let statusUpdateSpan: number = PRESENCE_UPDATE_INTERVAL;

  function postStatus(bot: Client): void {
    setTimeout(() => postStatus(bot), statusUpdateSpan);

    const postData = generatePostData(bot);
    if (!FAMILY_PASS_PHRASE || !TRANSACTION_API_ENDPOINT || !postData) return;

    const body = JSON.stringify(postData);

    const requst =  https.request(
      `${TRANSACTION_API_ENDPOINT}/health`,
      {
        method: 'POST',
        headers: {
          'www-authenticate': `Bearer ${FAMILY_PASS_PHRASE}`,
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(body)
        },
      },
      response => receiveResponse(response),
    )

    requst.on('error', console.error);
    requst.write(body);
    requst.end();
  }

  function generatePostData(bot: Client): ShardStatus | null {
    let { shardCount, shards } = bot.options;
    if (typeof shards === 'object') shards = shards[0];
    if (!shardCount || typeof shards !== 'number') return null;

    const guilds = bot.guilds.cache;

    return {
      shardCount: shardCount,
      shardID: shards,
      wsStatus: bot.ws.status,
      guildCount: guilds.size,
      userCount: guilds.reduce(
        (total, guild) => total + guild.memberCount - 1, 0
      ),
    }
  }

  function receiveResponse(response: IncomingMessage): void {
    if (
      response.statusCode !== 200
      || !/application\/json/.test(response.headers['content-type'] ?? '')
    ) return;

    let body = '';

    response.on('data', chunk => body += String(chunk));
    response.on('end', () => {
      const obj = JSON.parse(body);
      if (!isReceiveStatus(obj)) return;

      entire = obj;
      statusUpdateSpan = entire.updateSpan;
    });
  }

  function isReceiveStatus(obj: any): obj is ReceiveStatus {
    let isRegisterStatuses = false;

    for (const key in obj.statuses)
      isRegisterStatuses ||= isRegisterStatus(obj.statuses[key]);

    return (
      obj
      && typeof obj.completed       === 'boolean'
      && typeof obj.updateSpan      === 'number'
      && typeof obj.totalGuildCount === 'number'
      && typeof obj.totalUserCount  === 'number'
      && isRegisterStatuses
    );
  }

  function isRegisterStatus(obj: any): obj is RegisterStatus {
    return (
      obj
      && typeof obj.shardID             === 'number'
      && typeof obj.wsStatus            === 'number'
      && typeof obj.guildCount          === 'number'
      && typeof obj.userCount           === 'number'
      && typeof obj.lastUpdateTimestamp === 'number'
    );
  }
}
