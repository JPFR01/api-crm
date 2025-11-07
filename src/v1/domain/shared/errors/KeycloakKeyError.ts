export class KeycloakKeyError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'KeycloakKeyError';
        this.message = message;
        this.stack = stack;
    }
}
