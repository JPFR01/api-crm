"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payLoaderHelper = payLoaderHelper;
exports.optionsHelper = optionsHelper;
exports.tokenErrorHelper = tokenErrorHelper;
exports.tokenValidationHelper = tokenValidationHelper;
const errors_1 = require("../../../../v1/domain/shared/errors");
const Error_1 = require("../../../../v1/domain/shared/errors/Error");
function payLoaderHelper(payloadConfig) {
    return JSON.stringify(payloadConfig);
}
function optionsHelper(algorithm) {
    return {
        algorithm: algorithm,
    };
}
function tokenErrorHelper(error) {
    switch (error.name) {
        case 'TokenExpiredError':
            throw new errors_1.ExpiredJwtError(`${error.message} - ${error}`, 'Token de acesso expirado, favor realizar o login novamente!');
        case 'JsonWebTokenError':
            throw new errors_1.JsonWebTokenError(`${error.message} - ${error}`, 'Problemas ao validar o token de acesso, favor realizar o login novamente!');
        case 'NotBeforeError':
            throw new errors_1.NotBeforeError(`${error.message} - ${error}`, Error_1.patternMessage);
        default:
            throw new errors_1.ServerError(`${error.message} - ${error}`, Error_1.patternMessage);
    }
}
function tokenValidationHelper(header, controller) {
    if (!header.authorization || !header.authorization.trim().toLowerCase().startsWith('bearer '))
        throw new errors_1.AuthenticationError(`Controller: ${controller} - Error: Authentication Bearer token não informado`, 'Authentication Bearer token não informado');
}
