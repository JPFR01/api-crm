export class InvalidParamError extends Error {
    constructor(stack?: string, message?: string) {
        // Call super regardless of whether message is present
        super(message || 'Invalid Parameter');
        
        // Ensure name is correct
        this.name = 'InvalidParamError';
        
        // Force the message property to be set, potentially shadowing prototype getter
        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message || '',
            writable: true,
        });

        this.stack = stack;
        
        // Restore prototype chain
        Object.setPrototypeOf(this, InvalidParamError.prototype);
    }
}
