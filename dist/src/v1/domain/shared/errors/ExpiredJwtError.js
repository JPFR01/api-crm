"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiredJwtError = void 0;
class ExpiredJwtError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'ExpiredJwtError';
        this.stack = stack;
        this.message = message;
    }
}
exports.ExpiredJwtError = ExpiredJwtError;
