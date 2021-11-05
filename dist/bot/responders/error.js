"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale_1 = require("../templates/locale");
class CommandError {
    constructor(name, lang, permissions) {
        this.name = name;
        this.lang = lang;
        this.permissions = permissions;
        this.embed = locale_1.Locales[lang].errors[name](permissions ?? []);
    }
}
exports.default = CommandError;
