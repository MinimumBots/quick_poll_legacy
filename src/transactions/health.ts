import { IncomingMessage } from 'http';
import https from 'https';

import { Client } from 'discord.js';

import {
  TRANSACTION_API_ENDPOINT,
  FAMILY_PASS_PHRASE,
  PRESENCE_UPDATE_INTERVAL,
} from '../constants';

export namespace Health {
  interface CommonStatus {
    shardID   : number;
    wsStatus  : number; // Status value of the web socket on that shard.
    guildCount: number;
    userCount : number;
  }

  interface RegisterStatus extends CommonStatus {
    operational        : boolean; // Indicates whether the shard is operational.
    lastUpdateTimestamp: number;
  }

  interface ShardStatus extends CommonStatus {
    shardCount: number;
  }

  interface EntireStatus {
    ready          : boolean; // The data is complete or enough time has passed to collect the data.
    completed      : boolean; // Indicates that the data for all shards has been completed at least once.
    updateSpan     : number;  // Interval to have data sent from a shard.
    totalGuildCount: number;
    totalUserCount : number;
    statuses       : RegisterStatus[];
  }

  export function initialize(bot: Client<true>): void {
    postStatus(bot);
  }

  export let entire: EntireStatus | null = null;

  let statusUpdateSpan: number = PRESENCE_UPDATE_INTERVAL;

  function postStatus(bot: Client<true>): void {
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

  function generatePostData(bot: Client<true>): ShardStatus | null {
    let { shardCount, shards } = bot.options;
    if (Array.isArray(shards)) shards = shards[0];
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
    if (response.statusCode !== 200) return;

    let body = '';

    response.on('data', chunk => body += String(chunk));
    response.on('end', () => {
      const obj = JSON.parse(body);
      if (!isReceiveStatus(obj)) return;

      entire = obj;
      statusUpdateSpan = entire.updateSpan;
    });
  }

  function isReceiveStatus(obj: any): obj is EntireStatus {
    let isRegisterStatuses = true;

    for (const index in obj.statuses)
      isRegisterStatuses &&= isRegisterStatus(obj.statuses[index]);

    return (
      obj
      && typeof obj.ready           === 'boolean'
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
