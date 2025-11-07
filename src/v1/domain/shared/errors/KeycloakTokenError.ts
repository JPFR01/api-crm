export class KeycloakTokenError extends Error {
    constructor(stack?: string, message?: string) {
        super(stack);
        this.name = 'KeycloakTokenError';
        this.message = message;
        this.stack = stack;
    }
}
