export class NotFoundError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'NotFoundError';
        this.stack = stack;
        this.message = message;
    }
}
