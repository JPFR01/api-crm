export class JsonWebTokenError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'JwtError';
        this.stack = stack;
        this.message = message;
    }
}
