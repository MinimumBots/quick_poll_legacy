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
        if (typeof shards === 'object')
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
        if (response.statusCode !== 200
            || !/application\/json/.test(response.headers['content-type'] ?? ''))
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
        let isRegisterStatuses = false;
        for (const key in obj.statuses)
            isRegisterStatuses || (isRegisterStatuses = isRegisterStatus(obj.statuses[key]));
        return (obj
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zYWN0aW9ucy9oZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esa0RBQTBCO0FBSTFCLDRDQUlzQjtBQUV0QixJQUFpQixNQUFNLENBd0h0QjtBQXhIRCxXQUFpQixNQUFNO0lBd0JyQixTQUFnQixVQUFVLENBQUMsR0FBVztRQUNwQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUZlLGlCQUFVLGFBRXpCLENBQUE7SUFFVSxhQUFNLEdBQXlCLElBQUksQ0FBQztJQUUvQyxJQUFJLGdCQUFnQixHQUFXLG9DQUF3QixDQUFDO0lBRXhELFNBQVMsVUFBVSxDQUFDLEdBQVc7UUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXBELE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyw4QkFBa0IsSUFBSSxDQUFDLG9DQUF3QixJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxNQUFNLE1BQU0sR0FBSSxlQUFLLENBQUMsT0FBTyxDQUMzQixHQUFHLG9DQUF3QixTQUFTLEVBQ3BDO1lBQ0UsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCLEVBQUUsVUFBVSw4QkFBa0IsRUFBRTtnQkFDbEQsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7YUFDMUM7U0FDRixFQUNELFFBQVEsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUN0QyxDQUFBO1FBRUQsTUFBTSxDQUFD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