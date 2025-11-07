export class NotImplementedError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'NotImplementedError';
        this.stack = stack;
        this.message = message;
    }
}
