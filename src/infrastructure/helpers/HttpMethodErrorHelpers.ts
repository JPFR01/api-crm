export function getAuthErrorMessage(errorData: any): string {
    switch (errorData?.error) {
        case 'invalid_grant':
            return 'Usuário ou senha inválido!';
        case 'invalid_client':
            return 'Usuário inválido!';
        case 'unauthorized_client':
            return 'Usuário não autorizado!';
        default:
            return 'Erro de autenticação.';
    }
}

export function isExpiredTokenError(errorData: any): boolean {
    try {
        const parsedStack: any = typeof errorData?.stack === 'string' && errorData.stack.startsWith('{') ? JSON.parse(errorData.stack) : null;
        const errorCode: any = parsedStack?.error || errorData?.error;
        return errorCode === 'invalid_grant';
    } catch {
        return false;
    }
}
