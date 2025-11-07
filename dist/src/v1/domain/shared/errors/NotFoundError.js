"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'NotFoundError';
        this.stack = stack;
        this.message = message;
    }
}
exports.NotFoundError = NotFoundError;
