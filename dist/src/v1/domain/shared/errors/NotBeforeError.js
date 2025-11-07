"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotBeforeError = void 0;
class NotBeforeError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'NotBeforeError';
        this.stack = stack;
        this.message = message;
    }
}
exports.NotBeforeError = NotBeforeError;
