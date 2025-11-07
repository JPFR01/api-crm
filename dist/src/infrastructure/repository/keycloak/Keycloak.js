"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keycloak = void 0;
const axiosHelpers_1 = require("../../../../infrastructure/helpers/axiosHelpers");
const JwkCacheHelper_1 = require("../../../../infrastructure/helpers/JwkCacheHelper");
const KeycloakHelpers_1 = require("../../../../infrastructure/helpers/KeycloakHelpers");
const TokenHelper_1 = require("../../../../v1/application/helpers/TokenHelper");
const errors_1 = require("../../../../v1/domain/shared/errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Keycloak {
    constructor(httpMethods) {
        this.httpMethods = httpMethods;
    }
    async validate(input) {
        switch (input.method) {
            case 'authorize':
                if (!input.data.username) {
                    throw new errors_1.InvalidParamError('Method Keycloak.validate - Param username', 'O nome de usuário ou email deve ser informado!');
                }
                if (!input.data.password) {
                    throw new errors_1.InvalidParamError('Method Keycloak.validate - Param password', 'A senha deve ser informada!');
                }
                return;
            case 'refreshToken':
                if (!input.data.refreshToken) {
                    throw new errors_1.InvalidParamError('Method Keycloak.validate - Param refreshToken', 'O refreshToken deve ser informado!');
                }
                return;
            default:
                throw new errors_1.NotImplementedError(`Method Keycloak.validate - Method not implemented`, 'Funcionalidade não mapeada!');
        }
    }
    async authorize(data) {
        var _a, _b;
        await this.validate({ data: data, method: 'authorize' });
        const authData = (0, KeycloakHelpers_1.buildAuthParams)('password', {
            username: data.username,
            password: data.password,
            scope: 'openid profile email',
        });
        const keycloakAuthResponse = await this.httpMethods.post(process.env.PDCOOP_REALM_URL + '/protocol/openid-connect/token', authData, axiosHelpers_1.keycloakHeader, 'Keycloak.authorize');
        if (!((_a = keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data) === null || _a === void 0 ? void 0 : _a.access_token)) {
            throw new errors_1.KeycloakTokenError('Method Keycloak.authorize', 'Token de acesso não encontrado, realize o login novamente!');
        }
        const { given_name, family_name } = await this.openToken((_b = keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data) === null || _b === void 0 ? void 0 : _b.access_token);
        return { ...keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data, given_name, family_name };
    }
    async refreshToken(data) {
        var _a, _b;
        await this.validate({ data: data, method: 'refreshToken' });
        const authData = (0, KeycloakHelpers_1.buildAuthParams)('refresh_token', {
            refresh_token: data.refreshToken,
        });
        const keycloakAuthResponse = await this.httpMethods.post(process.env.PDCOOP_REALM_URL + '/protocol/openid-connect/token', authData, axiosHelpers_1.keycloakHeader, 'Keycloak.refreshToken');
        if (!((_a = keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data) === null || _a === void 0 ? void 0 : _a.access_token)) {
            throw new errors_1.KeycloakTokenError('Method Keycloak.refreshToken', 'Token de acesso não encontrado, realize o login novamente!');
        }
        const { given_name, family_name } = await this.openToken((_b = keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data) === null || _b === void 0 ? void 0 : _b.access_token);
        return { ...keycloakAuthResponse === null || keycloakAuthResponse === void 0 ? void 0 : keycloakAuthResponse.data, given_name, family_name };
    }
    async getKey(header) {
        let keys = JwkCacheHelper_1.JwkCache.get();
        if (!keys) {
            const { keys: fetchedKeys } = await this.httpMethods.get(`${process.env.PDCOOP_REALM_URL}/protocol/openid-connect/certs`, null, 'Keycloak.getKey');
            if (!fetchedKeys || fetchedKeys.length === 0) {
                throw new errors_1.KeycloakKeyError('Method Keycloak.getKey - JWKS key not found', 'Houveram problemas para recuperar as chaves de acesso, entre em contato com um administrador do sistema');
            }
            JwkCacheHelper_1.JwkCache.set(fetchedKeys);
            keys = fetchedKeys;
        }
        const signingKey = keys.find((key) => key.kid === header.kid);
        if (!signingKey) {
            throw new errors_1.KeycloakKeyError(`Method Keycloak.getKey - Access key not found for the key ${header.kid}`, 'Houveram problemas para recuperar as chaves de acesso, entre em contato com um administrador do sistema');
        }
        return (0, KeycloakHelpers_1.convertBase64ToPem)(signingKey.x5c[0]);
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
            if (!decoded || typeof decoded !== 'object' || !('header' in decoded)) {
                return 'Unauthorized';
            }
            const { header } = decoded;
            const publicKey = await this.getKey(header);
            jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
            return 'Active';
        }
        catch (error) {
            const err = error;
            if (err.name === 'TokenExpiredError') {
                return 'Expired';
            }
            return 'Unauthorized';
        }
    }
    async openToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
            if (!decoded || typeof decoded !== 'object' || !('header' in decoded)) {
                throw new errors_1.JsonWebTokenError('Method Keycloak.openToken - decode token error', 'Token informado é inválido !');
            }
            const { header } = decoded;
            const publicKey = await this.getKey(header);
            return jsonwebtoken_1.default.verify(token, publicKey, { issuer: process.env.REALM_TESTE_URL });
        }
        catch (error) {
            if (error instanceof errors_1.KeycloakKeyError) {
                throw error;
            }
            (0, TokenHelper_1.tokenErrorHelper)(error);
            throw error;
        }
    }
}
exports.Keycloak = Keycloak;
