"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Allocater = void 0;
const discord_js_1 = require("discord.js");
const constants_1 = require("../../constants");
const session_1 = require("./session");
const help_1 = require("../responders/help");
const rejecter_1 = require("../responders/rejecter");
const utils_1 = require("../utils");
const preferences_1 = require("../preferences");
const poll_1 = require("../responders/poll");
const result_1 = require("../responders/result");
const decrypter_1 = require("../listeners/decrypter");
const export_1 = require("../responders/export");
var Allocater;
(function (Allocater) {
    function initialize(bot) {
        help_1.Help.initialize(bot);
        poll_1.Poll.initialize();
        result_1.Result.initialize();
        export_1.Export.initialize();
    }
    Allocater.initialize = initialize;
    const responders = new discord_js_1.Collection();
    function entryResponder(header, responder) {
        decrypter_1.Decrypter.entryHeader(header);
        return responders.set(header, responder);
    }
    Allocater.entryResponder = entryResponder;
    function submit(request, header, args, botID) {
        const responder = responders.get(header);
        if (responder)
            respond(request, responder, header, args, botID)
                .catch(console.error);
    }
    Allocater.submit = submit;
    async function respond(request, responder, header, args, botID) {
        const session = session_1.Session.get(request.id);
        const response = session?.response ?? null;
        const lang = await preferences_1.Preferences.fetchLang(request.author, request.guild);
        try {
            const newResponse = await responder({
                botID, request, header, args, response, lang
            });
            if (!newResponse)
                return;
            allocate(request, newResponse, session);
        }
        catch (exception) {
            reject(exception, request);
        }
    }
    function reject(exception, request) {
        if (constants_1.DEBUG_MODE)
            console.error(exception);
        rejecter_1.Rejecter.issue(exception, request)
            .then(response => response && allocate(request, response))
            .catch(console.error);
    }
    function allocate(request, response, session) {
        if (!response)
            utils_1.Utils.removeMessageCache(request);
        else if (!session)
            session_1.Session.create(request, response);
    }
})(Allocater || (exports.Allocater = Allocater = {}));
;
