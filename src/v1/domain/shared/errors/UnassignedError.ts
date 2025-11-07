export class UnassignedError extends Error {
    constructor(stack: string, code: string, message?: string) {
        super(stack);
        this.name = `UnassignedError - ${code}`;
        this.message = message;
        this.stack = stack;
    }
}
