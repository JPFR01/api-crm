"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutConnectError = void 0;
class TimeoutConnectError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'TimeoutConnectError';
        this.stack = stack;
        this.message = message;
    }
}
exports.TimeoutConnectError = TimeoutConnectError;
