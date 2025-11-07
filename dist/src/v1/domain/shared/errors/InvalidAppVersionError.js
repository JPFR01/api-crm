"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAppVersionError = void 0;
class InvalidAppVersionError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'InvalidAppVersionError';
        this.message = message;
        this.stack = stack;
    }
}
exports.InvalidAppVersionError = InvalidAppVersionError;
