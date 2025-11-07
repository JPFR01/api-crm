export class PermissionError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'PermissionError';
        this.message = message;
        this.stack = stack;
    }
}
