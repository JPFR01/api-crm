export type tokenStatus = 'Active' | 'Expired' | 'Unauthorized';
export type algorithmToken = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512' | 'RS256' | 'RS384' | 'RS512';
export type tokenOptions = '24h' | number;

export interface OptionsToken {
    algorithm?: algorithmToken;
}

export interface PayLoadToken {
    foo?: string;
    iat?: number;
    data?: string;
    exp?: string | number;
    sub?: string;
    scope?: string;
    email_verified?: boolean;
    email?: string;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
}

export interface Token {
    authentication: (token: string) => Promise<tokenStatus>;
    open: (token: string) => Promise<PayLoadToken>;
}
