"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
class ServerError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'ServerError';
        this.stack = stack;
        this.message = message;
    }
}
exports.ServerError = ServerError;
