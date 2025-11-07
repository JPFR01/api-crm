export class AuthenticationError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'AuthenticationError';
        this.stack = stack;
        this.message = message;
    }
}
