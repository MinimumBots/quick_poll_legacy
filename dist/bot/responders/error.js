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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L3Jlc3BvbmRlcnMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxnREFBb0Q7QUFFcEQsTUFBcUIsWUFBWTtJQUcvQixZQUNXLElBQXlCLEVBQ3pCLElBQVUsRUFDVixXQUFnQztRQUZoQyxTQUFJLEdBQUosSUFBSSxDQUFxQjtRQUN6QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsZ0JBQVcsR0FBWCxXQUFXLENBQXFCO1FBRXpDLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDRjtBQVZELCtCQVVDIn0=