"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWebTokenError = void 0;
class JsonWebTokenError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'JwtError';
        this.stack = stack;
        this.message = message;
    }
}
exports.JsonWebTokenError = JsonWebTokenError;
