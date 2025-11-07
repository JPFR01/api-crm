"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = void 0;
class NotImplementedError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'NotImplementedError';
        this.stack = stack;
        this.message = message;
    }
}
exports.NotImplementedError = NotImplementedError;
