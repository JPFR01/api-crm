"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectConstructError = void 0;
class ObjectConstructError extends Error {
    constructor(stack, message) {
        super(stack);
        this.name = 'ObjectConstructError';
        this.stack = stack;
        this.message = message;
    }
}
exports.ObjectConstructError = ObjectConstructError;
