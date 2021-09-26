"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = void 0;
const constants_1 = require("../constants");
exports.Preferences = {
    async fetchLang(user, guild) {
        return (await this.fetchUserLang(user)
            ?? (guild && await this.fetchGuildLang(guild))
            ?? constants_1.DEFAULT_LANG);
    },
    async fetchUserLang(user) {
        return undefined;
    },
    async fetchGuildLang(guild) {
        return undefined;
    }
};
