export class ExpiredJwtError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'ExpiredJwtError';
        this.stack = stack;
        this.message = message;
    }
}
