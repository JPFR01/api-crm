"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
class AuthenticationError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'AuthenticationError';
        this.stack = stack;
        this.message = message;
    }
}
exports.AuthenticationError = AuthenticationError;
