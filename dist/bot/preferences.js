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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3ByZWZlcmVuY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDRDQUE0QztBQUcvQixRQUFBLFdBQVcsR0FJcEI7SUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLO1FBQ3pCLE9BQU8sQ0FDTCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2VBQzNCLENBQUMsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztlQUMzQyx3QkFBWSxDQUNoQixDQUFDO0lBQ0osQ0FBQztJQUNELEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSTtRQUN0QixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLO1FBQ3hCLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRixDQUFDIn0=