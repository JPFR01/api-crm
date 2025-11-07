export class InvalidAppVersionError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'InvalidAppVersionError';
        this.message = message;
        this.stack = stack;
    }
}
