"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
var Counter;
(function (Counter) {
    function count(context) {
        if (!constants_1.COUNTER_API_HOST_NAME)
            return;
        axios_1.default.get(`http://${constants_1.COUNTER_API_HOST_NAME}/count/${context}`)
            .catch(console.error);
    }
    Counter.count = count;
})(Counter = exports.Counter || (exports.Counter = {}));
