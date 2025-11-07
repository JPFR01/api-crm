export class InvalidHeaderError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'InvalidHeaderError';
        this.message = message;
        this.stack = stack;
    }
}
