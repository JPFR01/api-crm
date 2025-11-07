export class ObjectConstructError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'ObjectConstructError';
        this.stack = stack;
        this.message = message;
    }
}
