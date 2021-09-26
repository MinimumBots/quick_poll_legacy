"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const https_1 = __importDefault(require("https"));
const constants_1 = require("../constants");
var Health;
(function (Health) {
    function initialize(bot) {
        postStatus(bot);
    }
    Health.initialize = initialize;
    Health.entire = null;
    let statusUpdateSpan = constants_1.PRESENCE_UPDATE_INTERVAL;
    function postStatus(bot) {
        setTimeout(() => postStatus(bot), statusUpdateSpan);
        const postData = generatePostData(bot);
        if (!constants_1.FAMILY_PASS_PHRASE || !constants_1.TRANSACTION_API_ENDPOINT || !postData)
            return;
        const body = JSON.stringify(postData);
        const requst = https_1.default.request(`${constants_1.TRANSACTION_API_ENDPOINT}/health`, {
            method: 'POST',
            headers: {
                'www-authenticate': `Bearer ${constants_1.FAMILY_PASS_PHRASE}`,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(body)
            },
        }, response => receiveResponse(response));
        requst.on('error', console.error);
        requst.write(body);
        requst.end();
    }
    function generatePostData(bot) {
        let { shardCount, shards } = bot.options;
        if (Array.isArray(shards))
            shards = shards[0];
        if (!shardCount || typeof shards !== 'number')
            return null;
        const guilds = bot.guilds.cache;
        return {
            shardCount: shardCount,
            shardID: shards,
            wsStatus: bot.ws.status,
            guildCount: guilds.size,
            userCount: guilds.reduce((total, guild) => total + guild.memberCount - 1, 0),
        };
    }
    function receiveResponse(response) {
        if (response.statusCode !== 200)
            return;
        let body = '';
        response.on('data', chunk => body += String(chunk));
        response.on('end', () => {
            const obj = JSON.parse(body);
            if (!isReceiveStatus(obj))
                return;
            Health.entire = obj;
            statusUpdateSpan = Health.entire.updateSpan;
        });
    }
    function isReceiveStatus(obj) {
        let isRegisterStatuses = true;
        for (const index in obj.statuses)
            isRegisterStatuses && (isRegisterStatuses = isRegisterStatus(obj.statuses[index]));
        return (obj
            && typeof obj.ready === 'boolean'
            && typeof obj.completed === 'boolean'
            && typeof obj.updateSpan === 'number'
            && typeof obj.totalGuildCount === 'number'
            && typeof obj.totalUserCount === 'number'
            && isRegisterStatuses);
    }
    function isRegisterStatus(obj) {
        return (obj
            && typeof obj.shardID === 'number'
            && typeof obj.wsStatus === 'number'
            && typeof obj.guildCount === 'number'
            && typeof obj.userCount === 'number'
            && typeof obj.lastUpdateTimestamp === 'number');
    }
})(Health = exports.Health || (exports.Health = {}));
