"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidParamError = void 0;
class InvalidParamError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'InvalidParamError';
        this.message = message;
        this.stack = stack;
    }
}
exports.InvalidParamError = InvalidParamError;
