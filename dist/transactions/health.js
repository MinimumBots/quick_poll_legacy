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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zYWN0aW9ucy9oZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esa0RBQTBCO0FBSTFCLDRDQUlzQjtBQUV0QixJQUFpQixNQUFNLENBd0h0QjtBQXhIRCxXQUFpQixNQUFNO0lBMEJyQixTQUFnQixVQUFVLENBQUMsR0FBVztRQUNwQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUZlLGlCQUFVLGFBRXpCLENBQUE7SUFFVSxhQUFNLEdBQXdCLElBQUksQ0FBQztJQUU5QyxJQUFJLGdCQUFnQixHQUFXLG9DQUF3QixDQUFDO0lBRXhELFNBQVMsVUFBVSxDQUFDLEdBQVc7UUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXBELE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyw4QkFBa0IsSUFBSSxDQUFDLG9DQUF3QixJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFFMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxNQUFNLE1BQU0sR0FBSSxlQUFLLENBQUMsT0FBTyxDQUMzQixHQUFHLG9DQUF3QixTQUFTLEVBQ3BDO1lBQ0UsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCLEVBQUUsVUFBVSw4QkFBa0IsRUFBRTtnQkFDbEQsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7YUFDMUM7U0FDRixFQUNELFFBQVEsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUN0QyxDQUFBO1FBRUQsTUFBTSxDQUFD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