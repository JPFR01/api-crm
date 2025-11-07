export class InvalidParamError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'InvalidParamError';
        this.message = message;
        this.stack = stack;
    }
}
