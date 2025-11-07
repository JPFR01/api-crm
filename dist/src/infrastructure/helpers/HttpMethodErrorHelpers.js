"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthErrorMessage = getAuthErrorMessage;
exports.isExpiredTokenError = isExpiredTokenError;
function getAuthErrorMessage(errorData) {
    switch (errorData === null || errorData === void 0 ? void 0 : errorData.error) {
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
function isExpiredTokenError(errorData) {
    try {
        const parsedStack = typeof (errorData === null || errorData === void 0 ? void 0 : errorData.stack) === 'string' && errorData.stack.startsWith('{') ? JSON.parse(errorData.stack) : null;
        const errorCode = (parsedStack === null || parsedStack === void 0 ? void 0 : parsedStack.error) || (errorData === null || errorData === void 0 ? void 0 : errorData.error);
        return errorCode === 'invalid_grant';
    }
    catch {
        return false;
    }
}
