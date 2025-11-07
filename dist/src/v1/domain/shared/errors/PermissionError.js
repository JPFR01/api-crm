"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionError = void 0;
class PermissionError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'PermissionError';
        this.message = message;
        this.stack = stack;
    }
}
exports.PermissionError = PermissionError;
