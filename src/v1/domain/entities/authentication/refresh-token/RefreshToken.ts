import {LoginResponse} from '../login/Login';

export interface RefreshTokenData {
    refreshToken: string;
}

export interface RefreshToken {
    validate: (data: RefreshTokenData) => Promise<void>;
    refresh: (data: RefreshTokenData) => Promise<LoginResponse>;
}
