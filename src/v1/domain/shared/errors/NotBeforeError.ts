export class NotBeforeError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'NotBeforeError';
        this.stack = stack;
        this.message = message;
    }
}
