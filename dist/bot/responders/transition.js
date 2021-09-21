"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
const constants_1 = require("../../constants");
const allocater_1 = require("../allotters/allocater");
const locale_1 = require("../templates/locale");
var Transition;
(function (Transition) {
    function initialize() {
        allocater_1.Allocater.entryResponder('/poll', chunk => respond(chunk, 'poll'));
        allocater_1.Allocater.entryResponder('/expoll', chunk => respond(chunk, 'expoll'));
        allocater_1.Allocater.entryResponder('/sumpoll', chunk => respond(chunk, 'sumpoll'));
        allocater_1.Allocater.entryResponder('/endpoll', chunk => respond(chunk, 'endpoll'));
        allocater_1.Allocater.entryResponder('/csvpoll', chunk => respond(chunk, 'csvpoll'));
    }
    Transition.initialize = initialize;
    async function respond(chunk, name) {
        const embed = {
            color: locale_1.DefaultColors.errors,
            title: `⚠️ コマンドプレフィックスは「/」から「${constants_1.COMMAND_PREFIX}」へ変更されました`,
            description: `\`/${name}\` は \`${constants_1.COMMAND_PREFIX}${name}\` になります`
        };
        return chunk.response
            ? chunk.response.edit({ embeds: [embed] })
            : chunk.request.channel.send({ embeds: [embed] });
    }
})(Transition = exports.Transition || (exports.Transition = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvcmVzcG9uZGVycy90cmFuc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtDQUFpRDtBQUVqRCxzREFBaUU7QUFDakUsZ0RBQW9EO0FBRXBELElBQWlCLFVBQVUsQ0FzQjFCO0FBdEJELFdBQWlCLFVBQVU7SUFDekIsU0FBZ0IsVUFBVTtRQUN4QixxQkFBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdkUscUJBQVMsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLHFCQUFTLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMxRSxxQkFBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDMUUscUJBQVMsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFOZSxxQkFBVSxhQU16QixDQUFBO0lBRUQsS0FBSyxVQUFVLE9BQU8sQ0FDcEIsS0FBbUIsRUFBRSxJQUFZO1FBRWpDLE1BQU0sS0FBSyxHQUF3QjtZQUNqQyxLQUFLLEVBQUUsc0JBQWEsQ0FBQyxNQUFNO1lBQzNCLEtBQUssRUFBRSx3QkFBd0IsMEJBQWMsV0FBVztZQUN4RCxXQUFXLEVBQUUsTUFBTSxJQUFJLFVBQVUsMEJBQWMsR0FBRyxJQUFJLFVBQVU7U0FDakUsQ0FBQTtRQUVELE9BQU8sS0FBSyxDQUFDLFFBQVE7WUFDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMxQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7QUFDSCxDQUFDLEVBdEJnQixVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXNCMUIifQ==