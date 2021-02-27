"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preferences = void 0;
const constants_1 = require("./constants");
exports.Preferences = {
    async fetchLocale(user, guild) {
        return (await this.fetchUserLocale(user)
            ?? (guild && await this.fetchGuildLocale(guild))
            ?? constants_1.DEFAULT_LOCALE);
    },
    async fetchUserLocale(user) {
        return undefined;
    },
    async fetchGuildLocale(guild) {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZmVyZW5jZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYm90L3ByZWZlcmVuY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJDQUE2QztBQUdoQyxRQUFBLFdBQVcsR0FJcEI7SUFDRixLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLO1FBQzNCLE9BQU8sQ0FDTCxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO2VBQzdCLENBQUMsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQzdDLDBCQUFjLENBQ2xCLENBQUM7SUFDSixDQUFDO0lBQ0QsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJO1FBQ3hCLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSztRQUMxQixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0NBQ0YsQ0FBQyJ9