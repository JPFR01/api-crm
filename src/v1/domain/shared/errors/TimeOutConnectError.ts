export class TimeoutConnectError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'TimeoutConnectError';
        this.stack = stack;
        this.message = message;
    }
}
