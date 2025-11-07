import {PayLoadToken, tokenStatus} from '@/v1/domain/repository/token/Token';

export interface KeycloakData {
    username: string;
    password: string;
}

export interface KeycloakRefreshTokenData {
    refreshToken: string;
}

export interface KeycloakAuthResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    session_state: string;
    scope: string;
    given_name?: string;
    family_name?: string;
}

export interface KeycloakToken {
    header: {
        alg: string;
        typ: string;
        kid: string;
    };
    payload: {
        exp: number;
        iat: number;
        jti: string;
        iss: string;
        aud: string;
        sub: string;
        typ: string;
        azp: string;
        acr: string;
        'allowed-origins'?: string[];
        realm_access?: {
            roles: string[];
        };
        resource_access?: {
            [key: string]: {
                roles: string[];
            };
        };
        authorization?: {
            permissions?: {
                rsid?: string;
                rsname: string;
                scopes?: string[];
            }[];
        };
        scope?: string;
        email_verified?: boolean;
        preferred_username?: string;
    };
    signature: string;
}

export interface JwkKey {
    kid: string;
    kty: string;
    alg: string;
    use: string;
    n?: string;
    e?: string;
    x5c?: string[];
    x5t?: string;
    [key: string]: unknown;
}
export interface JwtHeader {
    kid: string;
    alg?: string;
    typ?: string;
}

export type keycloakMethod = 'authorize' | 'refreshToken';
export type keycloakValidateInput = {method: 'authorize'; data: KeycloakData} | {method: 'refreshToken'; data: KeycloakRefreshTokenData};

export interface Keycloak {
    validate: (input: keycloakValidateInput) => Promise<void>;
    authorize: (data: KeycloakData) => Promise<KeycloakAuthResponse>;
    refreshToken: (data: KeycloakRefreshTokenData) => Promise<KeycloakAuthResponse>;
    getKey: (header: JwtHeader) => Promise<string>;
    validateToken: (token: string) => Promise<tokenStatus>;
    openToken: (token: string) => Promise<PayLoadToken>;
}
