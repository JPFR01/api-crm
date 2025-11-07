"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnassignedError = void 0;
class UnassignedError extends Error {
    constructor(stack, code, message) {
        super(stack);
        this.name = `UnassignedError - ${code}`;
        this.message = message;
        this.stack = stack;
    }
}
exports.UnassignedError = UnassignedError;
