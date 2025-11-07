import {keycloakHeader} from '@/infrastructure/helpers/axiosHelpers';
import {JwkCache} from '@/infrastructure/helpers/JwkCacheHelper';
import {buildAuthParams, convertBase64ToPem} from '@/infrastructure/helpers/KeycloakHelpers';
import {tokenErrorHelper} from '@/v1/application/helpers/TokenHelper';
import {HttpMethod} from '@/v1/domain/repository/HttpMethod';
import {
    Keycloak as _Keycloak,
    JwkKey,
    JwtHeader,
    KeycloakAuthResponse,
    KeycloakData,
    KeycloakRefreshTokenData,
    KeycloakToken,
    keycloakValidateInput,
} from '@/v1/domain/repository/keycloak/Keycloak';
import {PayLoadToken, tokenStatus} from '@/v1/domain/repository/token/Token';
import {InvalidParamError, JsonWebTokenError, KeycloakKeyError, KeycloakTokenError, NotImplementedError} from '@/v1/domain/shared/errors';
import {HttpResponse} from '@/v1/presentation/protocols/Http';
import jwt from 'jsonwebtoken';

export class Keycloak implements _Keycloak {
    constructor(private readonly httpMethods: HttpMethod) {}

    async validate(input: keycloakValidateInput): Promise<void> {
        switch (input.method) {
            case 'authorize':
                if (!input.data.username) {
                    throw new InvalidParamError('Method Keycloak.validate - Param username', 'O nome de usuário ou email deve ser informado!');
                }
                if (!input.data.password) {
                    throw new InvalidParamError('Method Keycloak.validate - Param password', 'A senha deve ser informada!');
                }
                return;

            case 'refreshToken':
                if (!input.data.refreshToken) {
                    throw new InvalidParamError('Method Keycloak.validate - Param refreshToken', 'O refreshToken deve ser informado!');
                }
                return;

            default:
                throw new NotImplementedError(`Method Keycloak.validate - Method not implemented`, 'Funcionalidade não mapeada!');
        }
    }

    async authorize(data: KeycloakData): Promise<KeycloakAuthResponse> {
        await this.validate({data: data, method: 'authorize'});

        const authData: URLSearchParams = buildAuthParams('password', {
            username: data.username,
            password: data.password,
            scope: 'openid profile email',
        });

        const keycloakAuthResponse: HttpResponse = await this.httpMethods.post(
            process.env.PDCOOP_REALM_URL + '/protocol/openid-connect/token',
            authData,
            keycloakHeader,
            'Keycloak.authorize',
        );

        if (!keycloakAuthResponse?.data?.access_token) {
            throw new KeycloakTokenError('Method Keycloak.authorize', 'Token de acesso não encontrado, realize o login novamente!');
        }

        const {given_name, family_name} = await this.openToken(keycloakAuthResponse?.data?.access_token);
        return {...keycloakAuthResponse?.data, given_name, family_name};
    }

    async refreshToken(data: KeycloakRefreshTokenData): Promise<KeycloakAuthResponse> {
        await this.validate({data: data, method: 'refreshToken'});

        const authData: URLSearchParams = buildAuthParams('refresh_token', {
            refresh_token: data.refreshToken,
        });

        const keycloakAuthResponse: HttpResponse = await this.httpMethods.post(
            process.env.PDCOOP_REALM_URL + '/protocol/openid-connect/token',
            authData,
            keycloakHeader,
            'Keycloak.refreshToken',
        );

        if (!keycloakAuthResponse?.data?.access_token) {
            throw new KeycloakTokenError('Method Keycloak.refreshToken', 'Token de acesso não encontrado, realize o login novamente!');
        }

        const {given_name, family_name} = await this.openToken(keycloakAuthResponse?.data?.access_token);
        return {...keycloakAuthResponse?.data, given_name, family_name};
    }

    async getKey(header: JwtHeader): Promise<string> {
        let keys: JwkKey[] | null = JwkCache.get();

        if (!keys) {
            const {keys: fetchedKeys} = await this.httpMethods.get(
                `${process.env.PDCOOP_REALM_URL}/protocol/openid-connect/certs`,
                null,
                'Keycloak.getKey',
            );

            if (!fetchedKeys || fetchedKeys.length === 0) {
                throw new KeycloakKeyError(
                    'Method Keycloak.getKey - JWKS key not found',
                    'Houveram problemas para recuperar as chaves de acesso, entre em contato com um administrador do sistema',
                );
            }

            JwkCache.set(fetchedKeys);
            keys = fetchedKeys;
        }

        const signingKey: JwkKey | undefined = keys.find((key) => key.kid === header.kid);

        if (!signingKey) {
            throw new KeycloakKeyError(
                `Method Keycloak.getKey - Access key not found for the key ${header.kid}`,
                'Houveram problemas para recuperar as chaves de acesso, entre em contato com um administrador do sistema',
            );
        }

        return convertBase64ToPem(signingKey.x5c[0]);
    }

    async validateToken(token: string): Promise<tokenStatus> {
        try {
            const decoded: KeycloakToken = jwt.decode(token, {complete: true}) as KeycloakToken;
            if (!decoded || typeof decoded !== 'object' || !('header' in decoded)) {
                return 'Unauthorized';
            }

            const {header} = decoded as {header: JwtHeader};
            const publicKey: string = await this.getKey(header);

            jwt.verify(token, publicKey, {algorithms: ['RS256']});

            return 'Active';
        } catch (error: unknown) {
            const err = error as Error;
            if (err.name === 'TokenExpiredError') {
                return 'Expired';
            }
            return 'Unauthorized';
        }
    }

    async openToken(token: string): Promise<PayLoadToken> {
        try {
            const decoded: KeycloakToken = jwt.decode(token, {complete: true}) as KeycloakToken;
            if (!decoded || typeof decoded !== 'object' || !('header' in decoded)) {
                throw new JsonWebTokenError('Method Keycloak.openToken - decode token error', 'Token informado é inválido !');
            }

            const {header} = decoded as {header: JwtHeader};
            const publicKey: string = await this.getKey(header);
            return jwt.verify(token, publicKey, {issuer: process.env.REALM_TESTE_URL}) as PayLoadToken;
        } catch (error: Error | any) {
            if (error instanceof KeycloakKeyError) {
                throw error;
            }
            tokenErrorHelper(error);
            throw error;
        }
    }
}
