"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRefreshTokenError = void 0;
class InvalidRefreshTokenError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'InvalidRefreshTokenError';
        this.message = message;
        this.stack = stack;
    }
}
exports.InvalidRefreshTokenError = InvalidRefreshTokenError;
