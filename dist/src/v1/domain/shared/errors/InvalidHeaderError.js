"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidHeaderError = void 0;
class InvalidHeaderError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'InvalidHeaderError';
        this.message = message;
        this.stack = stack;
    }
}
exports.InvalidHeaderError = InvalidHeaderError;
