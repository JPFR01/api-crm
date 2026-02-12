export class ConflictError extends Error {
    constructor(stack?: string, message?: string) {
        super(message || 'Conflict Error');
        this.name = 'ConflictError';
        
        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message || '',
            writable: true,
        });

        this.stack = stack;
        
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
