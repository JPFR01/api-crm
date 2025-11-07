export class InvalidRefreshTokenError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'InvalidRefreshTokenError';
        this.message = message;
        this.stack = stack;
    }
}
