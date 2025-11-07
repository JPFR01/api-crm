"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakKeyError = void 0;
class KeycloakKeyError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'KeycloakKeyError';
        this.message = message;
        this.stack = stack;
    }
}
exports.KeycloakKeyError = KeycloakKeyError;
