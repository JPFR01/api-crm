export class ServerError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'ServerError';
        this.stack = stack;
        this.message = message;
    }
}
