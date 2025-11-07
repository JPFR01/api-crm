"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakTokenError = void 0;
class KeycloakTokenError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'KeycloakTokenError';
        this.message = message;
        this.stack = stack;
    }
}
exports.KeycloakTokenError = KeycloakTokenError;
